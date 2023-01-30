const { client } = require(DClientLoc);
const util = require('util')
const {join} = require("path");
const express = require("express")
const hbs = require("express-handlebars");
const app = express()

var port = process.env.PORT || 8080
var host = process.env.HOST

var layoutsDir = __dirname + "/views/layouts"
var partialsDir = __dirname + "/views/partials"


app.engine("hbs", hbs.create({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir,
    partialsDir
}).engine)

app.set("view engine", "hbs")
app.set("views", join(__dirname, "/views"))

app.use(express.static("public"))
app.use("/css", express.static(__dirname + "/public/css"))
app.use("/js", express.static(__dirname + "/public/js"))
app.use("/img", express.static(__dirname + "/public/img"))


app.get("/", async function(req, res) {

    if(req.query.guild_id != undefined) {
        let guild_id = req.query.guild_id;
        if(!client.guilds.cache.get(guild_id)) {
            let guilds = await require(join(__dirname, "src/load_all_guilds.js")).run();
            res.render('main', {layout: 'index', guilds, file: "main", bot_user: client.user});
        } else {
            let guild_data = await require(join(__dirname, "src/load_requested_guild.js")).run(guild_id);
            res.render('guild', {layout: 'index', guild_data, file: "guild"});
        }
    } else {
        let guilds = await require(join(__dirname, "src/load_all_guilds.js")).run();
        res.render('main', {layout: 'index', guilds, file: "main", bot_user: client.user});
    }

    
    
    
    /*
    guilds = await require(join(__dirname, "load_guilds.js")).run();
    res.render('main', {layout: 'index', guilds});
    */
})











app.listen(port, () => console.info(`${client.user.username} listening on port: ${port}`))