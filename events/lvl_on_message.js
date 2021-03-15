require("module-alias/register");
require("dotenv").config();
const { bot } = require('@src/bot');
const botconfig = require("@events/load_config_from_database");
const random = require('random')
const signpost = require("@handlers/ranks/signpost")
const { database } = require("@events/local_database")

function generateXP() {
    return random.int(10, 30)
}


function databaze(message) {
    var target = message.author
    //console.log(err + "\n")


    var target_data = bot.userstats.get(target.id)

    var xp = target_data.xp
    var tier = target_data.tier

    xp += (Math.ceil(generateXP() * (1 + tier / 10)))
    require("@src/bot").bot.userstats.get(target.id).xp = xp
    //let hodnoty = ({ type: "rankup", level: level, xp: xp, sql: sql, user: target, con: con, message: message })
    signpost.run(target.id, message, target)




}

bot.on("message", message => {
    let prefix = botconfig.filter(config => config.name == "PREFIX")[0]
    if (prefix == undefined) return
    if (message.author.bot || message.channel.type === "dm" || message.content.startsWith(prefix.value) || message.channel.name == "joins") return
    if (Date.now() - database.get(message.author.id).last_message < 60000) return
    database.get(message.author.id).last_message = Date.now()
    databaze(message);

})