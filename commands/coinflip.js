require("module-alias/register");
require("dotenv").config();
const coinflip = require("@handlers/coinflipcode")
const find_channel_by_name = require("@handlers/find_channel_by_name")
const { database } = require("@events/local_database")
const { bot } = require("@src/bot")
const xp_stats = require("@configs/xp_stats.json")

const name = "coinflip"
const accessableby = ["Member"]
const aliases = ["cf"]
const response = "GAME_ROOM_NAME";

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }

function allxp(level, xp) {
    var xpecka = xp
    for (let l = 0; l < level; l++) {
        var xpToNextLevel = 5 * Math.pow(l, 2) + 50 * l + 100;
        xpecka = xpecka + xpToNextLevel;
    }
    return (xpecka)
}

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    var cas = Date.now()
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("COINFLIP")
    if (!isNumber(args[0]) || !isNumber(args[1])) {

        let hodnotyout = ({ zprava: user_language.ERROR_MSG.replace("&PREFIX", botconfig.find(config => config.name == "PREFIX").value), roomname: botconfig.find(config => config.name == response).value, message: message })
        find_channel_by_name.run(hodnotyout)
        return
    }

    if (args[1] > 90) {

        let hodnotyout = ({ zprava: user_language.MAX_CHANCE, roomname: botconfig.find(config => config.name == response).value, message: message })
        find_channel_by_name.run(hodnotyout)
        return

    }

    if (args[1] < 10) {

        let hodnotyout = ({ zprava: user_language.MIN_CHANCE, roomname: botconfig.find(config => config.name == response).value, message: message })
        find_channel_by_name.run(hodnotyout)
        return

    }
    if (args[0] < 10) {

        let hodnotyout = ({ zprava: user_language.MIN_BET, roomname: botconfig.find(config => config.name == response).value, message: message })
        find_channel_by_name.run(hodnotyout)
        return

    }
    var lastmsg = bot.userstats.get(message.author.id).last_coinflip
    var milisekundy = (parseInt(lastmsg) + 600000) - cas
    var minuty = Math.round(milisekundy / 60000);







    let sql
    var xp
    var level
    var resallxp
    var tier
    var target = message.author

    let user_data = bot.userstats.get(target.id)
    xp = user_data.xp
    level = user_data.level
    tier = user_data.tier
    resallxp = xp_stats[level].total_xp_from_zero + xp



    if (resallxp < args[0]) {

        let hodnotyout = ({ zprava: user_language.NOT_ENOUGH_XP, roomname: botconfig.find(config => config.name == response).value, message: message })
        find_channel_by_name.run(hodnotyout)
        return

    }

    if (5000 < args[0]) {

        let hodnotyout = ({ zprava: user_language.MAX_BET, roomname: botconfig.find(config => config.name == response).value, message: message })
        find_channel_by_name.run(hodnotyout)
        return

    }

    if (Date.now() - lastmsg < 600000) {

        let hodnotyout = ({ zprava: user_language.COOLDOWN.replace("&MINUTY", minuty), roomname: botconfig.find(config => config.name == response).value, message: message })
        find_channel_by_name.run(hodnotyout)
        return

    }


    bot.userstats.get(message.author.id).last_coinflip = cas
    var sazka = ({ xp: args[0], pravdepodobnost: args[1] })
    await coinflip.run(sazka, sql, "con", xp, level, message, target, tier, xp, response)

    //sql = `UPDATE userstats SET last_coinflip = ${cas} WHERE id = '${message.author.id}'`;
    //con.query(sql)

}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases
}