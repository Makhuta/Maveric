const { client } = require(DClientLoc);
const util = require('util')
const {join} = require("path");
const express = require("express")
const hbs = require("express-handlebars");
const app = express()

var port = process.env.PORT || 8080
var host = process.env.HOST

var layoutslozka = __dirname + "/views/layouts"


app.engine("hbs", hbs.create({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: layoutslozka
}).engine)

app.set("view engine", "hbs")
app.set("views", join(__dirname, "/views"))

app.use(express.static("public"))
app.use("/css", express.static(__dirname + "/public/css"))
app.use("/js", express.static(__dirname + "/public/js"))
app.use("/img", express.static(__dirname + "/public/img"))


app.get("/*", async function(req, res) {
    guilds = await require(join(__dirname, "load_guilds.js")).run();
    //console.info(util.inspect(guilds, false, null, true));
    res.render('main', {layout: 'index', guilds});
})











app.listen(port, () => console.info(`${client.user.username} listening on port: ${port}`))