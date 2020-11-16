const express = require("express")
const hbs = require("express-handlebars")
const app = express()
const path = require("path")
const bodyParser = require("body-parser")
const fs = require("fs");
const { registerFont } = require("canvas");

const hbs_webout = __dirname + "/ws_handlers/views/"
const js_webout = __dirname + "/ws_handlers/getting_variables/"

var port = process.env.PORT || 8080

var default_token = "main"

app.engine("hbs", hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/ws_handlers/layouts"
}))

app.set("views", path.join(__dirname, "ws_handlers/views"))
app.set("view engine", "hbs")
app.use(express.static(path.join(__dirname, "/ws_handlers/public")))
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

app.get("/", async function (req, res) {
    var _token = req.query.site || default_token
    let host_value = "http://" + req.headers.host + "/?site="
    var js_exist = false
    var hbs_exist = false
    var out_name

    fs.readdir(hbs_webout, async (err, files) => {


        if (err) console.log(err);

        let hbsfile = files.filter(f => f.split(".").pop() === "hbs");
        if (hbsfile.length <= 0) {
            return;
        }
        hbsfile.forEach((f, i) => {
            let name = f.toLocaleString().split(".")[0]
            if (name != _token) {
                hbs_exist = hbs_exist
            }

            else {
                hbs_exist = !hbs_exist
                out_name = name.split("_").join(" ")
            }
        })



        fs.readdir(js_webout, async (err, files) => {
            let jsfile = files.filter(f => f.split(".").pop() === "js");
            if (jsfile.length <= 0) {
                return;
            }
            jsfile.forEach((f, i) => {
                let name = f.toLocaleString().split(".")[0]
                if (name != _token) {
                    js_exist = js_exist
                }

                else {
                    js_exist = !js_exist
                }
            })

            if (!hbs_exist) {
                let hodnoty = ({ res: res, view_hbs: hbs_webout + "error", title: "HBS ERROR", host_value: host_value, token: "error", app: app })
                await require("./ws_handlers/getting_variables/signpost").run(hodnoty)
            }

            else if (!js_exist) {
                let hodnoty = ({ res: res, view_hbs: hbs_webout + "error", title: "JS ERROR", host_value: host_value, token: "error", app: app })
                await require("./ws_handlers/getting_variables/signpost").run(hodnoty)
            }

            else {
                let title = out_name[0].toUpperCase() + out_name.slice(1)
                let hodnoty = ({ res: res, view_hbs: hbs_webout + _token, title: title, host_value: host_value, token: _token, app: app })
                await require("./ws_handlers/getting_variables/signpost").run(hodnoty)
                /*
                res.render(hbs_webout + _token, { title: out_name[0].toUpperCase() + out_name.slice(1), host_value: host_value, variables: variables });
                */
            }
        })
    })
})

app.listen(port, function () {
    console.log(`Website running on port ${port}`)
})