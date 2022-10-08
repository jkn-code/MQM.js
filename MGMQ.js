
class MGMQ {
    constructor(params) {
        this.params = params || {}
        this.pages = {}
        this.text = ''
        this.var = {}
        this.keys = []
        this._ends = []
        setTimeout(() => this._load(), 0) // for body
    }

    _load() {
        this._parseText()

        const style = document.createElement('style')
        style.type = 'text/css'
        const css = `
        body {
            margin: 0;
            font-family: Verdana;
            font-size: 2.2vh;
            overflow-y: scroll;
        }
        .plane {
            border-right: 1px solid `+ (this.params.borderColor || '#111') + `;
            border-left: 1px solid `+ (this.params.borderColor || '#111') + `;
            margin: auto;
            max-width: 600px;
            min-height: 100vh;
        }
        #mqImg {
            opacity: 0;
        }
        #mqImg img {
            width: 100%;
            display: block;
        }
        #mqText {
            padding: 20px;
            line-height: 25px;
            text-align: justify;
        }
        #mqText p {
            text-indent: 40px;
        }
        #mqBtns {
            margin: 50px 0 100px 0;
            opacity: 0;
        }
        .btn {
            padding: 20px;
            margin: 10px;
            border: 1px solid `+ (this.params.borderColor || this.params.textColor || '#0005') + `;
            border-radius: 10px;
            cursor: pointer;
            transition: 0.3s;
        }
        .btn:hover {
            background-color: #0002;
        }
        #mqFooter {
            height: 1px;
        }
        #mqOpenMenu {
            position: fixed;
            top: 5px;
            right: 5px;
            background-color: #fff3;
            width: 30px;
            height: 30px;
            border-radius: 30px;
            border: 1px solid #000a;
            cursor: pointer;
            z-idex: 10;
        }
        #mqMenu {
            position: fixed;
            top: 5px;
            right: 5px;
            background-color: #fffa;
            border: 1px solid #000a;
            z-idex: 11;
            display: none;
            width: 200px;
            color: #000;
        }
        #mqMenu div {
            text-align: center;
            padding: 10px;
            cursor: pointer;
            border-bottom: 1px solid #0002;
            transition: 0.3s;
        }
        #mqMenu div:hover {
            color: #0a0;
        }
        #_loadQ {
            max-height: 60vh;
            overflow-y: auto;
        }
        #mqMenu span {
            display: block;
            padding: 10px;
        }
        #_countQ {
            position: absolute;
            right: -5px;
            top: -5px;
            font-size: 12px;
        }
        #mqLoading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 500px;
        }
        #mqEnds {
            padding: 20px;
            text-align: center;
            margin-bottom: 40px;
            line-height: 70px;
        }
        #mqEnds span {
            padding: 10px 15px
        }
        @media(max-width: 600px) {
            .plane {
                border: 0px;
            }
        }
        `
        style.appendChild(document.createTextNode(css))
        document.head.appendChild(style)

        document.body.innerHTML += `<div class="plane">
            <div id="mqImg"></div>
            <div id="mqText"></div>
            <div id="mqBtns"></div>
            <div id="mqEnds"></div>
            <div id="mqFooter"></div>
            <div id="mqLoading"></div>
            <div id="mqOpenMenu"></div>
            <div id="mqMenu">
                <span id="_countQ">0</span>
                <div id="newQ">New</div>
                <div id="saveQ">Save</div>
                <span>Load:</span>
                <loads id="_loadQ"></loads>
            </div>
        </div>`

        if (this.params.bodyColor) document.body.style.backgroundColor = this.params.bodyColor
        if (this.params.textColor) {
            document.body.style.color = this.params.textColor
            document.querySelector('.plane').style.borderColor = this.params.textColor
            const rgb = document.body.style.color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
            style.appendChild(document.createTextNode('.btn:hover { background-color: rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ', 0.1); }'))
            document.head.appendChild(style)
        }
        if (this.params.borderColor) document.querySelector('.plane').style.borderColor = this.params.borderColor

        document.title = this.params.name

        const meta = document.createElement('meta')
        meta.name = 'viewport'
        meta.content = 'width=device-width, initial-scale=1.0'
        document.head.appendChild(meta)

        if (this.params.icon) {
            let link = document.createElement('link')
            link.rel = 'icon'
            link.href = this.params.icon
            document.head.appendChild(link)
        }

        window.onload = () => this._init()
    }

    _init() {
        this._page = {}
        this.goto = this.params.start || this._firstJ(this.pages)
        this._page = this.pages[this.goto]
        this._num = 0

        let noPages = []
        let gotos = []
        let noGotoPage = []
        let countP = 0
        for (const j in this.pages) {
            if (this.pages[j].btns)
                this.pages[j].btns.forEach(b => {
                    if (!this.pages[b.goto]) noPages.push(j + '=>' + b.goto)
                    if (b.goto) gotos.push(b.goto)
                })
            countP++
        }
        for (const j in this.pages)
            if (gotos.indexOf(j) == -1) noGotoPage.push(j)

        if (noPages.length > 0) console.log('No page: ' + noPages.join(', ') + '.')
        if (noGotoPage.length > 0) console.log('No goto: ' + noGotoPage.join(', ') + '.')

        mqBtns.addEventListener('click', e => this._btnClick(e))
        mqEnds.addEventListener('click', e => this._endClick(e))

        if (this.params.filter) mqImg.style.filter = this.params.filter;

        newQ.onclick = () => this._newQ()
        saveQ.onclick = () => this._saveQ()

        document.body.onclick = (e) => {
            if (e.target.id == 'mqOpenMenu') this._openMenu()
            else {
                mqOpenMenu.style.display = 'block'
                mqMenu.style.display = 'none'
            }
            if (e.target.classList.contains('load')) this._loadQ(e)
        }

        _countQ.innerHTML = countP

        this._getSave()
        this._loading()
    }

    _loading() {
        let imgs = 0, load = 0
        for (const j in this.pages) if (this.pages[j].img) {
            const src = this.pages[j].img
            this.pages[j].img = new Image()
            this.pages[j].img.src = src
            this.pages[j].img.onload = () => load++
            imgs++
        }

        const iv = setInterval(() => {
            mqLoading.innerHTML = ''
            for (let i = 0; i < imgs - load; i++)
                mqLoading.innerHTML += '. '

            if (imgs == load) {
                clearInterval(iv)
                this._setPage()
            }
        }, 10);
    }

    _btnClick(e) {
        if (this._noClick) return
        this._noClick = true
        const goto = e.target.getAttribute('goto')
        const idx = e.target.getAttribute('idx')
        if (goto) {
            this.goto = goto
            const btn = this._page.btns[idx]
            if (btn.click) btn.click(btn)
            if (btn.setKey) {
                let str2 = btn.setKey
                if (str2[0] != '!' && this.keys.indexOf(str2) == -1) this.keys.push(str2)
                if (str2[0] == '!' && this.keys.indexOf(str2.substr(1)) > -1) this.keys = this.keys.filter(e => e !== str2.substr(1))
            }
            if (btn.setKeyLine) btn.setKeyLine()
            this._page = this.pages[this.goto]
            if (this._page) this._shift('out')
            else console.log('PAIGE NO')
        }
    }

    _endClick(e) {
        if (this._noClick) return
        const goto = e.target.getAttribute('goto')
        if (goto) {
            if (confirm('To ending?')) {
                this._noClick = true
                this.goto = goto
                this._page = this.pages[this.goto]
                if (this._page) this._shift('out')
                else console.log('PAIGE NO')
            }
        }
        if (e.target.innerHTML == 'X') {
            if (confirm('Clear?')) {
                this._save.ends = []
                this._saveE()
                location.href = ''
            }
        }
    }

    _setPage() {
        window.scrollTo({ top: 0 })
        mqText.innerHTML = ''
        mqImg.innerHTML = ''
        mqBtns.innerHTML = ''
        mqEnds.innerHTML = ''
        this._noClick = false

        this._hideBtn = []

        if (!this._page) return

        if (this._page.img && this._page.img != '')
            mqImg.appendChild(this._page.img)

        if (this._page.text && this._page.text.trim() != '') {
            let tx = this._page.text
            const mv = tx.split('%')
            let t = true
            mv.forEach((vt, i) => {
                if (!t) mv[i] = this.var[vt]
                t = !t
            })
            tx = mv.join('')
            let mt = tx.split('\n')
            mqText.style.display = 'block'
            mqText.innerHTML = '<p>' + mt.join('<br></p><p>') + '</p>'
        } else mqText.style.display = 'none'

        if (this._page.btns) {
            this._page.btns.forEach((btn, idx) => {
                btn.hidden = false
                if (btn.init) btn.init(btn)
                if (btn.ifKey) {
                    let str2 = btn.ifKey
                    if (str2[0] != '!' && this.keys.indexOf(str2) == -1) btn.hidden = true
                    if (str2[0] == '!' && this.keys.indexOf(str2.substr(1)) > -1) btn.hidden = true
                }
                if (btn.ifKeyLine) btn.ifKeyLine(btn)
                if (btn.hidden) return

                const bd = document.createElement('div')
                bd.classList.add('btn')
                bd.innerHTML = btn.text
                bd.setAttribute('goto', btn.goto)
                bd.setAttribute('idx', idx)
                mqBtns.appendChild(bd)
                mqBtns.style.display = 'block'
            })
        } else mqBtns.style.display = 'none'

        if (this._page._endName) {
            if (this._save.ends.indexOf(this._page._endName) == -1)
                this._save.ends.push(this._page._endName)
            this._saveE()
        }

        if (this._num == 0 && this._ends.length > 0) {
            let s = ''
            this._ends.forEach((e, i) => {
                if (this._save.ends.indexOf(e) > -1)
                    s += '<span class="btn" goto="' + e + '">' + (i + 1) + '</span> '
                else s += '<span class="btn">_</span> '
            })
            mqEnds.innerHTML = s + '<br><span class="btn">X</span>'
        } else mqEnds.style.display = 'none'
        this._num++

        this._shift('in')
    }

    _shift(to) {
        let opacity
        if (to == 'in') opacity = 0
        if (to == 'out') opacity = 1
        mqImg.style.opacity = opacity
        mqText.style.opacity = opacity
        mqBtns.style.opacity = opacity
        let f = setInterval(() => {
            if (to == 'out') {
                opacity -= 0.05
                if (opacity <= 0) {
                    clearInterval(f)
                    this._setPage()
                }
            }
            if (to == 'in') {
                opacity += 0.05
                if (opacity >= 1) {
                    clearInterval(f)
                }
            }
            mqImg.style.opacity = opacity
            mqText.style.opacity = opacity
            mqBtns.style.opacity = opacity
        }, 20);
    }

    hideBtn(goto) {
        this._hideBtn.push(goto)
    }

    _openMenu() {
        this._getSave()
        mqOpenMenu.style.display = 'none'
        mqMenu.style.display = 'block'
        _loadQ.innerHTML = ''
        for (let i = this._save.saves.length - 1; i >= 0; i--)
            _loadQ.innerHTML += '<div class="load">' + this._save.saves[i].name + '</div>'
    }

    _getSave() {
        // localStorage.removeItem('MGMQ')
        const allSave = JSON.parse(localStorage['MGMQ'] || '{}')
        this._save = allSave[decodeURI(location.pathname)] || { saves: [], ends: [] }
    }

    _newQ() {
        location.href = ''
    }

    _saveQ() {
        const date = new Date()
        let name = this._zero(date.getHours()) + ':' + this._zero(date.getMinutes()) + ' ' +
            this._zero(date.getDate()) + '.' + this._zero(date.getMonth()) + '.' + date.getFullYear()
        if (name = prompt('Name', name)) {
            const allSave = JSON.parse(localStorage['MGMQ'] || '{}')
            const path = decodeURI(location.pathname)
            if (!allSave[path]) allSave[path] = { saves: [], ends: [] }
            allSave[path].saves.push({
                name: name,
                goto: this.goto,
                var: this.var,
                keys: this.keys,
            })
            localStorage['MGMQ'] = JSON.stringify(allSave)
            this._getSave()
        }
    }

    _saveE() {
        const allSave = JSON.parse(localStorage['MGMQ'] || '{}')
        const path = decodeURI(location.pathname)
        if (!allSave[path]) allSave[path] = { saves: [], ends: [] }
        allSave[path].ends = this._save.ends
        localStorage['MGMQ'] = JSON.stringify(allSave)
    }

    _loadQ(e) {
        if (confirm('Load [' + e.target.textContent + '] ?'))
            this._save.saves.forEach(save => {
                if (save.name == e.target.textContent) {
                    this.var = save.var
                    this.keys = save.keys
                    this._page = this.pages[save.goto]
                    if (this._page) this._shift('out')
                    else console.log('PAIGE NO')
                }
            })
    }

    _firstJ(m) {
        for (let j in m) return j
    }

    _firstV(m) {
        for (let j in m) return m[j]
    }

    _zero(n) {
        let d = 0
        if (n >= 10) d = ''
        return d + '' + n
    }

    _parseText() {
        if (this.text == '') return

        const lns = this.text.split('\n')
        let iin = false
        let name = ''
        let nBtn = -1
        const newPages = {}
        lns.forEach(ln => {
            const str2 = ln.substr(2).trim()

            if (ln.substr(0, 2) == '//') return
            if (name != '' && !newPages[name]) newPages[name] = { text: '' }

            if (ln[0] == '>') {
                if (ln.substr(0, 5) == '>name') this.params.name = ln.substr(5).trim()
                if (ln.substr(0, 5) == '>back') this.params.bodyColor = ln.substr(5).trim()
                if (ln.substr(0, 5) == '>text') this.params.textColor = ln.substr(5).trim()
                if (ln.substr(0, 7) == '>filter') this.params.filter = ln.substr(7).trim()
                if (ln.substr(0, 3) == '>++') {
                    if (this._ends.indexOf(name) == -1) this._ends.push(name)
                    if (newPages[name]) newPages[name]._endName = name
                }
            }
            else if (ln.substr(0, 3) != '***' && name != '') {
                if (ln.substr(0, 2) == '==') newPages[name].img = str2
                else if (ln.substr(0, 2) == '--') {
                    nBtn++
                    if (!newPages[name].btns) newPages[name].btns = []
                    if (!newPages[name].btns[nBtn]) newPages[name].btns[nBtn] = {}
                    newPages[name].btns[nBtn].text = str2
                }
                else if (ln.substr(0, 2) == '..') {
                    if (nBtn > -1) newPages[name].btns[nBtn].goto = str2
                }
                else if (ln.substr(0, 2) == '++')
                    newPages[name].btns[nBtn].setKeyLine = () => {
                        if (str2[0] != '!' && this.keys.indexOf(str2) == -1) this.keys.push(str2)
                        if (str2[0] == '!' && this.keys.indexOf(str2.substr(1)) > -1) this.keys = this.keys.filter(e => e !== str2.substr(1))
                    }
                else if (ln.substr(0, 2) == '??') {
                    const btn = newPages[name].btns[nBtn]
                    newPages[name].btns[nBtn].ifKeyLine = () => {
                        if (str2[0] != '!' && this.keys.indexOf(str2) == -1) btn.hidden = true
                        if (str2[0] == '!' && this.keys.indexOf(str2.substr(1)) > -1) btn.hidden = true
                    }
                }
                else if (ln.substr(0, 2) == '^^') newPages[name].text += '<center>' + str2 + '</center>\n'
                else if (ln.trim() != '') newPages[name].text += ln + '\n'
            } else {
                name = ln.substr(3).trim()
                nBtn = -1
            }
        })

        for (const j in newPages) {
            if (this.pages[j] && this.pages[j].text) newPages[j].text = this.pages[j].text
            if (this.pages[j] && this.pages[j].img) newPages[j].img = this.pages[j].img
            if (this.pages[j] && this.pages[j].btns)
                this.pages[j].btns.forEach((btn, i) => {
                    if (btn.text) newPages[j].btns[i].text = btn.text
                    if (btn.goto) newPages[j].btns[i].goto = btn.goto
                    if (btn.setKey) newPages[j].btns[i].setKey = btn.setKey
                    if (btn.ifKey) newPages[j].btns[i].ifKey = btn.ifKey
                    if (btn.click) newPages[j].btns[i].click = btn.click
                })
        }

        for (const j in this.pages)
            if (!newPages[j]) newPages[j] = this.pages[j]

        this.pages = newPages
    }

}