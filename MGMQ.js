
class MGMQ {
    constructor(params) {
        this.params = params
        this.pages = {}
        this.var = {}
        this.keys = []
        this.step = 0
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
            border: 1px solid `+ (this.params.borderColor || '#0005') + `;
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
        }
        #loadQ {
            max-height: 60vh;
            overflow-y: auto;
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
                <div id="newQ">New</div>
                <div id="saveQ">Save</div>
                <br> &nbsp; Load:
                <div id="loadQ"></div>
            </div>
        </div>`

        if (this.params.bgPage) document.body.style.backgroundColor = this.params.bgPage
        if (this.params.fontColor) document.body.style.color = this.params.fontColor
        if (this.params.borderColor) document.querySelector('.plane').style.borderColor = this.params.borderColor

        window.onload = () => this._init()
    }

    _init() {
        this._parseText()

        this._page = {}
        if (!this.params.start) this._page = this._firstV(this.pages)
        else this._page = this.pages[this.params.start]

        if (!document.createElement('title')) document.createElement('title')
        document.title = this.params.name

        let noPages = []
        for (const j in this.pages)
            if (this.pages[j].btns)
                this.pages[j].btns.forEach(b => {
                    if (!this.pages[b.goto]) noPages.push(j + '=>' + b.goto)
                })
        if (noPages.length > 0) console.log('PAIGE NO: ' + noPages.join(', ') + '.')

        this._plane = document.querySelector('.plane')
        this._pause = this.params.pause || 500
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
            if (e.target.classList.contains('load')) {
                if (confirm('Load [' + e.target.textContent + '] ?'))
                    this._save.forEach(save => {
                        if (save.name == e.target.textContent) {
                            this.var = save.var
                            this._page = this.pages[save.goto]
                            if (this._page) this._shift('out')
                            else console.log('PAIGE NO')
                        }
                    })
            }
        }

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
            if (btn.click) btn.click()
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

    _setPage() {
        window.scrollTo({ top: 0 })
        this._text.innerHTML = ''
        this._img.innerHTML = ''
        this._btns.innerHTML = ''
        this.step++
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
        const save = JSON.parse(localStorage['MGMQ'] || '{}')
        this._save = save[decodeURI(location.pathname)] || []
    }

    _newQ() {
        location.href = ''
    }

    _saveQ() {
        const date = new Date()
        let name = this._zero(date.getHours()) + ':' + this._zero(date.getMinutes()) + ' ' +
            this._zero(date.getDate()) + '.' + this._zero(date.getMonth()) + '.' + date.getFullYear()
        if (name = prompt('Name', name)) {
            const save = JSON.parse(localStorage['MGMQ'] || '{}')
            const path = decodeURI(location.pathname)
            if (!save[path].length) save[path] = []
            save[path].push({
                name: name,
                goto: this.goto,
                var: this.var,
            })
            localStorage['MGMQ'] = JSON.stringify(save)
            this._getSave()
        }
    }

    _firstV(m) {
        for (let v in m) return m[v]
    }

    _zero(n) {
        let d = 0
        if (n >= 10) d = ''
        return d + '' + n
    }

    _parseText() {
        if (!this.lines) return
        
        const lns = this.lines.split('\n')
        let iin = false
        let name = ''
        let nBtn = -1
        lns.forEach(ln => {
            if (name != '' && !this.pages[name]) this.pages[name] = {}
            const str2 = ln.substr(2).trim()

            if (ln.substr(0, 3) == '***') {
                name = ln.substr(3).trim()
                nBtn = -1
            } else if (ln.substr(0, 2) == '==') this.pages[name].img = str2
            else if (ln.substr(0, 2) == '--') {
                nBtn++
                if (!this.pages[name].btns) this.pages[name].btns = []
                if (!this.pages[name].btns[nBtn]) this.pages[name].btns[nBtn] = {}
                this.pages[name].btns[nBtn].text = str2
            } else if (ln.substr(0, 2) == '..') this.pages[name].btns[nBtn].goto = str2
            else if (ln.substr(0, 2) == '++')
                this.pages[name].btns[nBtn].setKeyLine = () => {
                    if (str2[0] != '!' && this.keys.indexOf(str2) == -1) this.keys.push(str2)
                    if (str2[0] == '!' && this.keys.indexOf(str2.substr(1)) > -1) this.keys = this.keys.filter(e => e !== str2.substr(1))
                }
            else if (ln.substr(0, 2) == '??') {
                const btn = this.pages[name].btns[nBtn]
                this.pages[name].btns[nBtn].ifKeyLine = () => {
                    if (str2[0] != '!' && this.keys.indexOf(str2) == -1) btn.hidden = true
                    if (str2[0] == '!' && this.keys.indexOf(str2.substr(1)) > -1) btn.hidden = true
                }
            } else if (ln.substr(0, 2) != '//' && name != '') {
                if (!this.pages[name].text) this.pages[name].text = ''
                this.pages[name].text += ln
            }

        })
    }

}