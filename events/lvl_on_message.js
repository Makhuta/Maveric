require("module-alias/register");
require("dotenv").config();
const { bot } = require('@src/bot');
const botconfig = require("@events/load_config_from_database");
const random = require('random')
const signpost = require("@handlers/ranks/signpost")
const { database } = require("@events/local_database");
const database_access = require("@handlers/database_access");

function generateXP() {
    return random.int(10, 30)
}


async function databaze(message) {
    var target = message.author
    //console.log(err + "\n")


    var target_data = await database_access.get(message, target)

    var xp = target_data.xp
    var tier = target_data.tier

    target_data.xp += (Math.ceil(generateXP() * (1 + tier / 10)))
    await database_access.set(message, target, target_data)
    //let hodnoty = ({ type: "rankup", level: level, xp: xp, sql: sql, user: target, con: con, message: message })
    await signpost.run(target.id, message, target)




}

bot.on("message", async message => {
    let prefix = botconfig.filter(config => config.name == "PREFIX")[0]
    if (prefix == undefined) return
    if (message.author.bot || message.channel.type === "dm" || message.content.startsWith(prefix.value) || message.channel.name == "joins") return
    if (Date.now() - await database_access.get(message, message.author).last_message < 60000) return
    bot.userstats.get(message.author.id).last_message = Date.now()
    await databaze(message);

})