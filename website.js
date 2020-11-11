const express = require("express")
const hbs = require("express-handlebars")
const app = express()
const path = require("path")
const bodyParser = require("body-parser")
const fs = require("fs");
const { bot } = require("./bot")

const webout = __dirname + "/ws_handlers/views/"

var port = process.env.PORT || 8080

var default_token = "index"

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

app.get("/", function (req, res) {
    var _token = req.query.token

    if (_token == undefined) {
        _token = default_token
    }

    fs.readdir(webout, (err, files) => {
        let exist = false

        if (err) console.log(err);

        let jsfile = files.filter(f => f.split(".").pop() === "hbs");
        if (jsfile.length <= 0) {
            return;
        }
        jsfile.forEach((f, i) => {
            let name = f.toLocaleString().split(".")[0]
            if (name != _token) {
                exist = exist
            }

            else if (name == _token) {
                exist = true
            }
        });

        if (!exist) {
            res.render(webout + "error", { title: "discord bot website" });
        }

        else {
            res.render(webout + _token, { title: "discord bot website" });
        }
    });
})

app.listen(port, function () {
    console.log(`Website running on port ${port}`)
})





console.log(bot)