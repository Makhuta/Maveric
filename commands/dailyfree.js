require("module-alias/register");
require("dotenv").config();
const signpost = require("@handlers/ranks/signpost")
const { database } = require("@events/local_database")

const name = "dailyfree"
const accessableby = ["Member"]
const aliases = ["df"]

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("DAILYFREE")
    let user_data = database.get(message.author.id)
    let sql
    let target = message.author
    var cas = Date.now()
    var xp = user_data.xp
    var tier = user_data.tier
    var level = user_data.level
    var last_claim = user_data.last_daily_xp
    var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
    var reward = Math.round((xpToNextLevel / 100) * (1 + tier / 10))
    var cas_ted = Date.now()
    var milisekundy = (parseInt(last_claim) + 86400000) - cas_ted
    var minuty = Math.round(milisekundy / 60000);
    var hodiny = Math.floor(minuty / 60)
    minuty -= (hodiny * 60)
        //console.log(`${hodiny}:${minuty}`)
    if (Date.now() - last_claim < 86400000) return (target.send(user_language.ALREADY_WITHDRAWED.replace("&HODINY", hodiny).replace("&MINUTY", minuty)))
    xp += Math.ceil(reward * (1 + (tier / 10)))
        //let hodnoty = ({ type: "rankup", sql: sql, con: con, user: target, level: level, xpToNextLevel: xpToNextLevel, xp: xp, message: message })
    database.get(target.id).xp = xp
    database.get(target.id).last_daily_xp = cas
    signpost.run(target.id, message, target)
        //sql = `UPDATE userstats SET last_daily_xp = ${cas} WHERE id = '${message.author.id}'`;
        //con.query(sql)
    target.send(user_language.WITHDRAW.replace("&REWARD", reward))

}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases
}