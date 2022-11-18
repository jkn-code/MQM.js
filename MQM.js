
class MQM {
    constructor(params) {
        this.cfg = {}
        this.pages = {}
        this.text = ''
        this.countCh = 0
        this.countP = 0
        this.endings = []
        window.onload = () => this.crtHtml()
    }


    crtHtml() {
        this.parseText()

        document.body.innerHTML += `<div class="plane">
            <div id="mqImg"></div>
            <div id="mqText"></div>
            <div id="mqBtns"></div>
            <div id="mqEnds"></div>
            <div id="mqFooter"></div>
            <div id="mqLoading"></div>
            <div id="mqOpenMenu">&equiv;</div>
            <div id="mqMenu">
                <span id="mqCountQ">Pages: 0 &nbsp; Letters: 0</span>
                <div id="newQ">New</div>
                <div id="saveQ">Save</div>
                <span>Load:</span>
                <loads id="mqLoadQ"></loads>
            </div>
        </div>`

        if (this.cfg.name) document.title = this.cfg.name

        const meta = document.createElement('meta')
        meta.name = 'viewport'
        meta.content = 'width=device-width, initial-scale=1.0'
        document.head.appendChild(meta)

        if (this.cfg.icon) {
            let link = document.createElement('link')
            link.rel = 'icon'
            link.href = this.cfg.icon
            document.head.appendChild(link)
        }

        if (!this.cfg.noCss) this.crtCss()

        setTimeout(() => this.init(), 50)
    }


    crtCss() {
        const style = document.createElement('style')
        style.type = 'text/css'
        const css = `
        body {
            margin: 0;
            font-family: Verdana;
            font-size: 2.2vh;
            overflow-y: scroll;
            background-color: `+ (this.cfg.bodyColor || '#fff') + `;
            color: `+ (this.cfg.textColor || '#000') + `;
        }
        .plane {
            border-right: 1px solid `+ (this.cfg.borderColor || '#f00') + `;
            border-left: 1px solid `+ (this.cfg.borderColor || '#f00') + `;
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
            border: 1px solid `+ (this.cfg.borderColor || '#f005') + `;
            border-radius: 10px;
            cursor: pointer;
            transition: 0.3s;
        }
        .btn:hover {
            background-color: `+ (this.cfg.borderColor || '#f001') + `;
        }
        #mqFooter {
            height: 1px;
        }
        #mqOpenMenu {
            position: fixed;
            top: 5px;
            right: 5px;
            width: 30px;
            height: 30px;
            text-align: center;
            line-height: 27px;
            font-size: 35px;
            cursor: pointer;
            z-idex: 10;
            transition: 0.3s;
        }
        #mqOpenMenu:hover {
            color: #aaa;
        }
        #mqMenu {
            position: fixed;
            top: 5px;
            right: 5px;
            background-color: #fff;
            1border: 1px solid #000a;
            box-shadow: rgba(0, 0, 0, .5) 0 2px 5px 0;
            z-idex: 11;
            display: none;
            width: 200px;
            color: #000;
            padding: 15px;
            border-radius: 8px;
        }
        #mqMenu div {
            background-color: #fff;
            border: 1px solid #d5d9d9;
            border-radius: 8px;
            box-shadow: rgba(213, 217, 217, .5) 0 2px 5px 0;
            box-sizing: border-box;
            font-family: "Amazon Ember",sans-serif;
            font-size: 13px;
            padding: 10px;
            margin-bottom: 3px;
            cursor: pointer;
            transition: 0.3s;
        }
        #mqMenu div:hover {
            background-color: #eee;
        }
        #mqLoadQ {
            max-height: 60vh;
            overflow-y: auto;
        }
        #mqMenu span {
            display: block;
            padding: 10px;
            font-size: 12px;
        }
        #mqCountQ {
            font-size: 12px;
            padding: 0 0 10px 0!important;
            text-align: center;
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

        if (this.cfg.borderColor) {
            mqImg.style.color = this.cfg.borderColor
            const rgb = mqImg.style.color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
            style.appendChild(document.createTextNode('.btn:hover { background-color: rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ', 0.1); }'))
            style.appendChild(document.createTextNode('.btn { border-color: rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ', 0.5); }'))
        }

        if (this.cfg.filter) mqImg.style.filter = this.cfg.filter;
    }


    init() {
        this.nowPage = {}
        this.goto = this.goto || this.firstJ(this.pages)
        this.nowPage = this.pages[this.goto]
        this.num = 0

        let noPages = []
        let gotos = []
        let noGotoPage = []
        for (const j in this.pages) {
            if (this.pages[j].btns)
                this.pages[j].btns.forEach(b => {
                    if (!this.pages[b.goto]) noPages.push(j + '=>' + b.goto)
                    if (b.goto) gotos.push(b.goto)
                })
            if (this.pages[j].forks)
                this.pages[j].forks.forEach(f => {
                    if (!this.pages[f.goto]) noPages.push(j + '=>' + f.goto)
                    if (f.goto) gotos.push(f.goto)
                })
            this.countP++
        }
        for (const j in this.pages)
            if (gotos.indexOf(j) == -1) noGotoPage.push(j)

        if (noPages.length > 0) console.log('No page: ' + noPages.join(', ') + '.')
        if (noGotoPage.length > 0) console.log('No goto: ' + noGotoPage.join(', ') + '.')

        mqCountQ.innerHTML = 'Pages: ' + this.countP + ' &nbsp; Letters: ' + this.countCh

        mqBtns.addEventListener('click', e => this.btnClick(e))
        mqEnds.addEventListener('click', e => this.endClick(e))

        newQ.onclick = () => this.newQ()
        saveQ.onclick = () => this.saveQ()

        document.body.onclick = (e) => {
            if (e.target.id == 'mqOpenMenu') this.openMenu()
            else {
                mqOpenMenu.style.display = 'block'
                mqMenu.style.display = 'none'
            }
            if (e.target.classList.contains('load')) this.loadQ(e)
        }


        this.loading()
    }


    loading() {
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
                this.workPage()
            }
        }, 10);
    }


    workPage() {
        console.log(this.nowPage);
        if (this.nowPage.forks) {
            let goto, fnStr
            this.nowPage.forks.forEach(fr => {
                if (goto) return
                eval('if (' + fr.if + ') { goto = "' + fr.goto + '"; fnStr = `' + fr.fnStr + '`; }')
            })
            if (goto) {
                if (fnStr) eval(fnStr)
                this.goto = goto
                this.nowPage = this.pages[this.goto]
                this.workPage()
            }
        } else this.shift('in')

        if (!this.nowPage) return console.log('PAIGE NO')
    }


    btnClick(e) {
        if (this.noClick) return
        this.noClick = true
        const goto = e.target.getAttribute('goto')
        const idx = e.target.getAttribute('idx')
        if (goto) {
            this.goto = goto
            const btn = this.nowPage.btns[idx]
            if (btn.fnStr) eval(btn.fnStr)
            this.nowPage = this.pages[this.goto]
            this.shift('out')
        }
    }


    endClick(e) {
        if (this.noClick) return
        const goto = e.target.getAttribute('goto')
        if (goto) {
            if (confirm('To ending?')) {
                const ends = this.getSave('ends')
                console.log(goto, ends[goto], ends);
                this.vars.forEach(v => window[v] = ends[goto].vars[v])
                this.goto = goto
                this.nowPage = this.pages[this.goto]
                if (this.nowPage) this.shift('out')
                else console.log('PAIGE NO')
            }
        }
        if (e.target.innerHTML == 'X') {
            if (confirm('Clear?')) {
                const allSave = JSON.parse(localStorage['MGMQ'] || '{}')
                const path = decodeURI(location.pathname)
                if (!allSave[path]) allSave[path] = { pages: [], ends: {} }
                allSave[path].ends = {}
                localStorage['MGMQ'] = JSON.stringify(allSave)
                location.href = ''
            }
        }
    }


    printPage() {
        window.scrollTo({ top: 0 })
        mqText.innerHTML = ''
        mqImg.innerHTML = ''
        mqBtns.innerHTML = ''
        mqEnds.innerHTML = ''

        if (!this.nowPage) return

        if (this.nowPage.img && this.nowPage.img != '')
            mqImg.appendChild(this.nowPage.img)

        if (this.nowPage.text && this.nowPage.text.trim() != '') {
            let tx = this.nowPage.text
            const mv = tx.split('%')
            let t = true
            mv.forEach((vt, i) => {
                try {
                    mv[i] = eval(vt.trim())
                } catch (a) {
                }
            })
            tx = mv.join('')
            let mt = tx.split('\n')
            mqText.style.display = 'block'
            mqText.innerHTML = '<p>' + mt.join('<br></p><p>') + '</p>'
        } 

        if (this.nowPage.btns) {
            this.nowPage.btns.forEach((btn, idx) => {
                if (btn.if) {
                    btn.hidden = true
                    eval('if (' + btn.if + ') btn.hidden = false')
                    if (btn.hidden) return
                }
                mqBtns.innerHTML += '<div class="btn" goto="' + btn.goto +
                    '" idx="' + idx + '">' + btn.text + '</div>'
            })
        } else mqBtns.style.display = 'none'


        if (this.nowPage.endName) {
            const ends = this.getSave('ends')
            const allSave = JSON.parse(localStorage['MGMQ'] || '{}')
            const path = decodeURI(location.pathname)
            if (!allSave[path]) allSave[path] = { pages: [], ends: {} }

            const vars = {}
            this.vars.forEach(v => vars[v] = window[v])

            allSave[path].ends[this.goto] = { vars: vars }
            localStorage['MGMQ'] = JSON.stringify(allSave)
        }

        if (this.num == 0 && this.endings.length > 0) {
            let s = ''
            const ends = this.getSave('ends')
            this.endings.forEach((e, i) => {
                if (ends[e])
                    s += '<span class="btn" goto="' + e + '">' + (i + 1) + '</span> '
                else
                    s += '<span class="btn">_</span> '
            })
            mqEnds.innerHTML = s + '<br><span class="btn">X</span>'
        } else mqEnds.style.display = 'none'
        this.num++

        this.noClick = false
    }


    shift(to) {
        let opacity
        if (to == 'in') {
            opacity = 0
            this.printPage()
        }
        if (to == 'out') opacity = 1
        mqImg.style.opacity = opacity
        mqText.style.opacity = opacity
        mqBtns.style.opacity = opacity
        let f = setInterval(() => {
            if (to == 'out') {
                opacity -= 0.05
                if (opacity <= 0) {
                    clearInterval(f)
                    this.workPage()
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


    openMenu() {
        const pages = this.getSave('pages')
        mqOpenMenu.style.display = 'none'
        mqMenu.style.display = 'block'
        mqLoadQ.innerHTML = ''
        for (let i = pages.length - 1; i >= 0; i--)
            mqLoadQ.innerHTML += '<div class="load" idx="' + i + '">' + pages[i].name.replace(/\n/g, '<br>') + '</div>'
    }


    getSave(name) {
        const allSave = JSON.parse(localStorage['MGMQ'] || '{}')
        if (allSave[decodeURI(location.pathname)])
            return allSave[decodeURI(location.pathname)][name]
        else return []
    }


    newQ() {
        location.href = ''
    }


    saveQ() {
        const date = new Date()
        let name = this.zero(date.getHours()) + ':' +
            this.zero(date.getMinutes()) + ' ' +
            this.zero(date.getDate()) + '.' +
            this.zero(date.getMonth()) + '.' +
            date.getFullYear() + ' \n' +
            this.pages[this.goto].text.replace(/(<([^>]+)>)/gi, "").substr(0, 20) + '...'

        if (name = prompt('Name', name)) {
            const allSave = JSON.parse(localStorage['MGMQ'] || '{}')
            const path = decodeURI(location.pathname)
            if (!allSave[path]) allSave[path] = { pages: [], ends: {} }

            const vars = {}
            this.vars.forEach(v => vars[v] = window[v])

            allSave[path].pages.push({
                name: name,
                goto: this.goto,
                vars: vars,
            })
            localStorage['MGMQ'] = JSON.stringify(allSave)
        }
    }

    
    loadQ(e) {
        const pages = this.getSave('pages')
        const idx = e.target.getAttribute('idx')
        if (confirm('Load [' + e.target.textContent + '] ?'))
            pages.forEach((save, i) => {
                if (i == idx) {
                    this.vars.forEach(v => window[v] = save.vars[v])
                    this.goto = save.goto
                    this.nowPage = this.pages[this.goto]
                    if (this.nowPage) this.shift('out')
                    else console.log('PAIGE NO')
                }
            })
    }


    firstJ(m) {
        for (let j in m) return j
    }


    zero(n) {
        let d = 0
        if (n >= 10) d = ''
        return d + '' + n
    }


    parseText() {
        if (this.text == '') return
        const lns = this.text.split('\n')
        let iin = false
        let name = ''
        let nBtn = -1
        let nFrk = -1
        this.vars = []
        const newPages = {}
        const tags = ['>name', '>icon', '>back', '>text', '>border', '>filter', '>nocss', '>var', '>start', '!!!', '***', '==', '??-', '++', '..', '??', '::', '^^', '//']
        lns.forEach(ln => {
            const m = ln.split(' ')
            const key = m.splice(0, 1)[0]
            const str = ln.replace(key, '').trim()

            if (key == '//') return
            if (key == '>name') this.cfg.name = str
            if (key == '>icon') this.cfg.icon = str
            if (key == '>back') this.cfg.bodyColor = str
            if (key == '>text') this.cfg.textColor = str
            if (key == '>border') this.cfg.borderColor = str
            if (key == '>filter') this.cfg.filter = str
            if (key == '>nocss') this.cfg.noCss = true
            if (key == '>var') str.split(',').forEach(v => window[v.trim()] = undefined)
            if (key == '>start') this.goto = str
            if (key == '!!!') {
                if (this.endings.indexOf(name) == -1) this.endings.push(name)
                if (newPages[name]) newPages[name].endName = name
            }
            if (key == '***') {
                name = str
                nBtn = -1
                nFrk = -1
                newPages[name] = { text: '' }
            }
            if (name == '') return
            if (key == '==') {
                nBtn++
                if (!newPages[name].btns) newPages[name].btns = []
                if (!newPages[name].btns[nBtn]) newPages[name].btns[nBtn] = {}
                newPages[name].btns[nBtn].text = str
                newPages[name].btns[nBtn].fnStr = ''
            }
            if (key == '??-') {
                nFrk++
                if (!newPages[name].forks) newPages[name].forks = []
                if (!newPages[name].forks[nFrk]) newPages[name].forks[nFrk] = {}
                newPages[name].forks[nFrk].if = str
                newPages[name].forks[nFrk].fnStr = ''
            }
            if (key == '++') newPages[name].img = str
            if (key == '..') {
                if (nBtn > -1) newPages[name].btns[nBtn].goto = str
                if (nFrk > -1) newPages[name].forks[nFrk].goto = str
            }
            if (key == '??') if (nBtn > -1) newPages[name].btns[nBtn].if = str
            if (key == '::') {
                if (nBtn > -1) newPages[name].btns[nBtn].fnStr += str + '\n'
                if (nFrk > -1) newPages[name].forks[nFrk].fnStr += str + '\n'
            }
            if (key == '^^') newPages[name].text += '<center>' + str + '</center>\n'
            if (!tags.includes(key)) {
                if (ln.trim() != '') newPages[name].text += ln + '\n'
                this.countCh += ln.length
            }
        })

        for (const j in newPages) {
            if (this.pages[j] && this.pages[j].text) newPages[j].text = this.pages[j].text
            if (this.pages[j] && this.pages[j].img) newPages[j].img = this.pages[j].img
            if (this.pages[j] && this.pages[j].btns)
                this.pages[j].btns.forEach((btn, i) => {
                    if (btn.text) newPages[j].btns[i].text = btn.text
                    if (btn.goto) newPages[j].btns[i].goto = btn.goto
                    if (btn.fnStr) newPages[j].btns[i].fnStr = btn.fnStr
                })
        }

        for (const j in this.pages)
            if (!newPages[j]) newPages[j] = this.pages[j]

        this.pages = newPages
    }
}

function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const log = console.log

function round(n, c) {
    return n.toFixed(c)
}