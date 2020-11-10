const express = require("express")
const hbs = require("express-handlebars")
const bodyParser = require("body-parser")
const path = require("path")
const { AsyncLocalStorage } = require("async_hooks")

async function statistiky(mems, con, bot) {
    con.query(`SELECT * FROM userstats`, (err, rows) => {
        if (err) throw err;
        rows.forEach(user => {
            let uzivatel = bot.users.cache.find(u => u.id === user.id)
            mems.push({id: user.id, xp: user.xp, username: uzivatel.username, level: user.level, discriminator: "#" + uzivatel.discriminator})
        })
        console.log(mems)


        
    })
}

class WebSocket {

    constructor(token, port, bot, con) {
        this.token = token
        this.bot = bot
        this.con = con

        this.app = express()
        this.app.engine("hbs", hbs({
            extname: "hbs",
            defaultLayout: "layout",
            layoutsDir: __dirname + "/layouts"
        }))
        this.app.set("views", path.join(__dirname, "views"))
        this.app.set("view engine", "hbs")
        this.app.use(express.static(path.join(__dirname, "public")))
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json())

        this.registerRoots()

        this.server = this.app.listen(port, () => {
            console.log(`Websocket listening on port ${this.server.address().port}`)
        })
    }

    checkToken(_token) {
        return (_token == this.token)
    }

    registerRoots() {

        this.app.get("/", (req, res) => {
            var _token = req.query.token

            if (!this.checkToken(_token)) {
                res.render('error', { title: "ERROR", errtype: "INVALID TOKEN" })
                return
            }

            var mems = [{id: "ID", xp: "XP", username: "USERNAME", level: "LEVEL", discriminator: "DISCRIMINATOR"}]
            statistiky(mems, this.con, this.bot)

            res.render("index", {
                title: "discordBot webinterface",
                token: _token,
                mems
            })
        })

        this.app.post("/sendMessage", async (req, res) => {
            var _token = req.body.token
            var text = req.body.text
            var channelid = req.body.channelid

            if (!this.checkToken(_token))
                return

            var chan = await this.bot.guilds.cache.first().channels.cache.get(channelid)
            console.log(channelid)
            if (chan) {
                console.log(chan)
                chan.send(text)
            }
        })

    }

}


module.exports = WebSocket