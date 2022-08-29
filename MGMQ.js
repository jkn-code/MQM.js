
class MGMQ {
    constructor(params) {
        this.params = params
        this.page = {}
        this.text = ''
        this.var = {}
        this.keys = []
        this._load()
    }

    _load() {

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
        .img {
            position: relative;
            opacity: 0;
        }
        .img img {
            width: 100%;
        }
        .text {
            position: relative;
            padding: 20px;
            line-height: 25px;
            opacity: 0;
            text-align: justify;
        }
        .text p {
            text-indent: 40px;
        }
        .btns {
            margin: 50px 0 100px 0;
            opacity: 0;
        }
        .btn {
            position: relative;
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
        .footer {
            height: 1px;
        }
        #openMenu {
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
        #menu {
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
        #menu div {
            text-align: center;
            padding: 10px;
            cursor: pointer;
            border-bottom: 1px solid #0002;
            transition: 0.3s;
        }
        #menu div:hover {
            color: #0a0;
        }
        #loadQ {
            max-height: 60vh;
            overflow-y: auto;
        }
        #menu span {
            display: block;
            padding: 10px;
        }
        #countQ {
            position: absolute;
            right: -5px;
            top: -5px;
            font-size: 12px;
        }
        @media(max-width: 600px) {
            .plane {
                border: 0px;
            }
        }
        `
        style.appendChild(document.createTextNode(css))
        document.head.appendChild(style)

        document.body.innerHTML = `<div class="plane">
            <div class="img"></div>
            <div class="text"></div>
            <div class="btns"></div>
            <div class="footer"></div>
            <div id="openMenu"></div>
            <div id="menu">
                <span id="countQ">0</span>
                <div id="newQ">New</div>
                <div id="saveQ">Save</div>
                <span>Load:</span>
                <loads id="loadQ"></loads>
            </div>
        </div>`

        if (this.params.bodyColor) document.body.style.backgroundColor = this.params.bodyColor
        if (this.params.textColor) {
            document.body.style.color = this.params.textColor
            document.querySelector('.plane').style.borderColor = this.params.textColor
            const rgb = document.body.style.color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
            style.appendChild(document.createTextNode('.btn:hover { background-color: rgba('+ rgb[0] +','+ rgb[1] +','+ rgb[2] +', 0.1); }'))
            document.head.appendChild(style)    
        }
        if (this.params.borderColor) document.querySelector('.plane').style.borderColor = this.params.borderColor

        if (this.params.icon) {
            let link = document.createElement('link')
            link.rel = 'icon'
            link.href = this.params.icon
            document.head.appendChild(link)
        }

        window.onload = () => this._init()
    }

    _init() {
        this._parseText()

        this._page = {}
        this.goto = this.params.start || this._firstJ(this.page)
        this._page = this.page[this.goto]

        if (!document.createElement('title')) document.createElement('title')
        document.title = this.params.name

        let noPages = []
        let gotos = []
        let noGotoPage = []
        let countP = 0
        for (const j in this.page) {
            if (this.page[j].btns)
                this.page[j].btns.forEach(b => {
                    if (!this.page[b.goto]) noPages.push(j + '=>' + b.goto)
                    if (b.goto) gotos.push(b.goto)
                })
            countP++
        }
        for (const j in this.page)
            if (gotos.indexOf(j) == -1) noGotoPage.push(j)

        if (noPages.length > 0) console.log('No page: ' + noPages.join(', ') + '.')
        if (noGotoPage.length > 0) console.log('No goto: ' + noGotoPage.join(', ') + '.')

        this._plane = document.querySelector('.plane')
        this._text = document.querySelector('.text')
        this._img = document.querySelector('.img')
        this._btns = document.querySelector('.btns')
        this._btns.addEventListener('click', e => this._btnClick(e))

        newQ.onclick = () => this._newQ()
        saveQ.onclick = () => this._saveQ()

        document.body.onclick = (e) => {
            if (e.target.id == 'openMenu') this._openMenu()
            else {
                openMenu.style.display = 'block'
                menu.style.display = 'none'
            }
            if (e.target.classList.contains('load')) this._loadQ(e)
        }

        countQ.innerHTML = countP

        this._getSave()
        this._loading()
    }

    _loading() {
        let imgs = 0, load = 0
        for (const j in this.page) if (this.page[j].img) {
            const src = this.page[j].img
            this.page[j].img = new Image()
            this.page[j].img.src = src
            this.page[j].img.onload = () => load++
            imgs++
        }
        const iv = setInterval(() => {
            if (imgs == load) {
                clearInterval(iv)
                this._setPage()
            }
        }, 50);
    }

    _btnClick(e) {
        if (this._noClick) return
        this._noClick = true
        this.goto = e.target.getAttribute('goto')
        const idx = e.target.getAttribute('idx')
        if (this.goto) {
            const btn = this._page.btns[idx]
            if (btn.click) btn.click(btn)
            if (btn.setKey) {
                let str2 = btn.setKey
                if (str2[0] != '!' && this.keys.indexOf(str2) == -1) this.keys.push(str2)
                if (str2[0] == '!' && this.keys.indexOf(str2.substr(1)) > -1) this.keys = this.keys.filter(e => e !== str2.substr(1))
            }
            if (btn.setKeyLine) btn.setKeyLine()
            this._page = this.page[this.goto]
            if (this._page) this._shift('out')
            else console.log('PAIGE NO')
        }
    }

    _setPage() {
        window.scrollTo({ top: 0 })
        this._text.innerHTML = ''
        this._img.innerHTML = ''
        this._btns.innerHTML = ''
        this._noClick = false

        this._hideBtn = []

        if (!this._page) return

        if (this._page.img && this._page.img != '')
            this._img.appendChild(this._page.img)

        if (this._page.text && this._page.text != '') {
            let text = this._page.text
            const mv = text.split('%')
            let t = true
            mv.forEach((vt, i) => {
                if (!t) mv[i] = this.var[vt]
                t = !t
            })
            text = mv.join('')
            let mt = text.split('\n')
            this._text.innerHTML = '<p>' + mt.join('<br></p><p>') + '</p>'
        }

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
                this._btns.appendChild(bd)
            })
        }

        this._shift('in')
    }

    _shift(to) {
        let opacity
        if (to == 'in') opacity = 0
        if (to == 'out') opacity = 1
        this._img.style.opacity = opacity
        this._text.style.opacity = opacity
        this._btns.style.opacity = opacity
        let f = setInterval(() => {
            this._img.style.opacity = opacity
            this._text.style.opacity = opacity
            this._btns.style.opacity = opacity
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
        }, 20);
    }

    hideBtn(goto) {
        this._hideBtn.push(goto)
    }

    _openMenu() {
        this._getSave()
        openMenu.style.display = 'none'
        menu.style.display = 'block'
        loadQ.innerHTML = ''
        for (let i = this._save.length - 1; i >= 0; i--)
            loadQ.innerHTML += '<div class="load">' + this._save[i].name + '</div>'
    }

    _getSave() {
        const allSave = JSON.parse(localStorage['MGMQ'] || '{}')
        this._save = allSave[decodeURI(location.pathname)] || []
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
            if (!allSave[path]) allSave[path] = []
            allSave[path].push({
                name: name,
                goto: this.goto,
                var: this.var,
                keys: this.keys,
            })
            localStorage['MGMQ'] = JSON.stringify(allSave)
            this._getSave()
        }
    }

    _loadQ(e) {
        if (confirm('Load [' + e.target.textContent + '] ?'))
            this._save.forEach(save => {
                if (save.name == e.target.textContent) {
                    this.var = save.var
                    this.keys = save.keys
                    this._page = this.page[save.goto]
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
        if (!this.text || this.text == '') return

        const lns = this.text.split('\n')
        let iin = false
        let name = ''
        let nBtn = -1
        const newPages = {}
        lns.forEach(ln => {
            if (name != '' && !newPages[name]) newPages[name] = {}
            const str2 = ln.substr(2).trim()

            if (ln.substr(0, 3) == '***') {
                name = ln.substr(3).trim()
                nBtn = -1
            } else if (ln.substr(0, 2) == '==') newPages[name].img = str2
            else if (ln.substr(0, 2) == '--') {
                nBtn++
                if (!newPages[name].btns) newPages[name].btns = []
                if (!newPages[name].btns[nBtn]) newPages[name].btns[nBtn] = {}
                newPages[name].btns[nBtn].text = str2
            } else if (ln.substr(0, 2) == '..') newPages[name].btns[nBtn].goto = str2
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
            } else if (ln.substr(0, 2) != '//' && name != '') {
                if (!newPages[name].text) newPages[name].text = ''
                if (ln.trim() != '') newPages[name].text += ln + '\n'
            }

        })

        for (const j in newPages) {
            if (this.page[j] && this.page[j].text) newPages[j].text = this.page[j].text
            if (this.page[j] && this.page[j].img) newPages[j].img = this.page[j].img
            if (this.page[j] && this.page[j].btns) {
                this.page[j].btns.forEach((btn, i) => {
                    if (btn.text) newPages[j].btns[i].text = btn.text
                    if (btn.goto) newPages[j].btns[i].goto = btn.goto
                    if (btn.setKey) newPages[j].btns[i].setKey = btn.setKey
                    if (btn.ifKey) newPages[j].btns[i].ifKey = btn.ifKey
                    if (btn.click) newPages[j].btns[i].click = btn.click
                })
            }
        }
        for (const j in this.page)
            if (!newPages[j]) newPages[j] = this.page[j]

        this.page = newPages
    }

}