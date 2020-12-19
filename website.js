const express = require("express")
const hbs = require("express-handlebars")
const app = express()
const path = require("path")
const bodyParser = require("body-parser")
const fs = require("fs");
const { registerFont } = require("canvas");
const RequestIp = require('@supercharge/request-ip')
const { request } = require("http")

const hbs_webout = __dirname + "/ws_handlers/views/"
const js_webout = __dirname + "/ws_handlers/getting_variables/"
const public_path = __dirname + "/ws_handlers/public";

var port = process.env.PORT || 8080

var default_token = "main"

var layoutslozka = __dirname + "/ws_handlers/layouts"

app.engine("hbs", hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: layoutslozka
}))

app.set("views", path.join(__dirname, "ws_handlers/views"))
app.set("view engine", "hbs")
app.use("/public", express.static(path.join(public_path)))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname));

fs.readdir("./fonts/", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "ttf");
    if (jsfile.length <= 0) {
        console.log("There isn't any fonts to load!");
        return;
    }
    console.log(`Loading ${jsfile.length} fonts...`)
    jsfile.forEach((f, i) => {
        let name = f.toLocaleString().split(".")
        console.log(`${i + 1}: ${name[0]} web loaded!`)
        registerFont(`./fonts/${f}`, { family: `${name[0]}` })
    });
});

app.get("/", async function(req, res) {
    var _token = req.query.site || default_token
    let host_value = (process.env.SECURITY || "http://") + req.headers.host + "/?site="
    var js_list = []
    var hbs_list = []
    var js_exist = []
    var hbs_exist = []



    var ip = RequestIp.getClientIp(req)

    if (!module.exports.web.visitors.includes(ip)) {
        module.exports.web.visitors.push(ip)
    }

    let styles_names = fs.readdirSync(public_path + "/styles")
    let scripts_names = fs.readdirSync(public_path + "/scripts")

    let styles = []
    let scripts = []

    styles_names.forEach(style => {
        styles.push({ name: style })
    })

    scripts_names.forEach(script => {
        scripts.push({ name: script })
    })

    var public_list = ({ styles: styles, scripts: scripts })

    let hbs_folders = fs.readdirSync(hbs_webout)
    let hbs_files

    let js_folders = fs.readdirSync(js_webout)
    let sp_pos = js_folders.indexOf(js_folders.find(s => s == "signpost.js"))
    js_folders.splice(sp_pos, sp_pos + 1)
    let js_files

    hbs_folders.forEach(f => {
        hbs_files = fs.readdirSync(hbs_webout + f)
        let soubory_bez_koncovky = []
        hbs_files.forEach(s => {
            soubory_bez_koncovky.push(s.split(".")[0])
        })
        hbs_list.push(soubory_bez_koncovky)
    })

    js_folders.forEach(f => {
        js_files = fs.readdirSync(js_webout + f)
        let soubory_bez_koncovky = []
        js_files.forEach(s => {
            soubory_bez_koncovky.push(s.split(".")[0])
        })
        js_list.push(soubory_bez_koncovky)
    })

    hbs_list.forEach(file => {
        hbs_exist.push(file.includes(_token))
    })

    js_list.forEach(file => {
        js_exist.push(file.includes(_token))
    })

    if (!(hbs_exist.includes(true))) {
        let slozka = js_folders.indexOf('main')
        let hodnoty = ({ res: res, view_hbs: hbs_webout + js_folders[slozka] + "/" + "error", title: "HBS ERROR", host_value: host_value, token: "error", app: app, folder: js_folders[slozka], layoutsDir: layoutslozka, public_list: public_list })
        await require("./ws_handlers/getting_variables/signpost").run(hodnoty)
    } else if (!(js_exist.includes(true))) {
        let slozka = js_folders.indexOf('main')
        let hodnoty = ({ res: res, view_hbs: hbs_webout + js_folders[slozka] + "/" + "error", title: "JS ERROR", host_value: host_value, token: "error", app: app, folder: js_folders[slozka], layoutsDir: layoutslozka, public_list: public_list })
        await require("./ws_handlers/getting_variables/signpost").run(hodnoty)
    } else {
        let slozka = js_exist.indexOf(true)
        let name = _token
        let out_name = name.split("_").join(" ")
        let title = out_name[0].toUpperCase() + out_name.slice(1)
        let hodnoty = ({ res: res, view_hbs: hbs_webout + js_folders[slozka] + "/" + _token, title: title, host_value: host_value, token: _token, app: app, folder: js_folders[slozka], layoutsDir: layoutslozka, public_list: public_list })
        await require("./ws_handlers/getting_variables/signpost").run(hodnoty)
    }
})

app.listen(port, function() {
    console.log(`Website running on port ${port}`)
})

app.post("/sendMessage", async(req, res) => {
    var _token = req.body.token

    let hodnoty = ({ req: req, res: res })
    await require("./ws_handlers/zpravy_format/" + _token + ".js").run(hodnoty)
})

module.exports.web = {
    ip: process.env.PING_WEBSITE || "No website IP.",
    visitors: [],
    start: Date.now()
}