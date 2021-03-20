require("module-alias/register");
require("dotenv").config();
const signpost = require("@handlers/ranks/signpost")
const { database } = require("@events/local_database")
const { bot } = require("@src/bot")

const name = "eventxp"
const accessableby = ["Bulgy", "Admins", "Moderátor", "Eventer"]
const aliases = ["exp"]
const response = "COMMAND_ROOM_NAME"

async function addxp(targetid, targetusername, numofxp, message, target, user_language, botconfig) {

    let user_data = bot.userstats.get(targetid)
    var xp = user_data.xp
    var level = user_data.level
    var tier = user_data.tier
    user_data.xp += (numofxp * (1 + (tier / 10)))
    var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
    await require("@src/bot").bot.userstats.set(target.id, user_data)
        //let hodnoty = ({ type: "rankup", sql: sql, con: con, user: target, level: level, xpToNextLevel: xpToNextLevel, xp: xp, message: message })
    await signpost.run(targetid, message, target)

    let hodnotyout = ({ zprava: user_language.XP_ADDED.replace("&NUM_OF_XP", numofxp).replace("&TARGET_USERNAME", targetusername), roomname: botconfig.find(config => config.name == response).value, message: message })
    require("@handlers/find_channel_by_name").run(hodnotyout)
}


function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("EVENTXP")
    let target = message.mentions.users.first() || message.guild.members.cache.get(args[1]);
    if (target === undefined) {

        let hodnotyout = ({ zprava: user_language.WRONG_USER, roomname: botconfig.find(config => config.name == response).value, message: message })
        require("@handlers/find_channel_by_name").run(hodnotyout)
        return
    }
    var targetid = target.id
    var targetusername = target.username
    var numofxp = parseInt(args[1])
    if (isInt(args[1]) && args[1] > 0) {
        addxp(targetid, targetusername, numofxp, message, target, user_language, botconfig)
    } else if (!isInt(args[1])) {

        let hodnotyout = ({ zprava: user_language.WRONG_FORMAT, roomname: botconfig.find(config => config.name == response).value, message: message })
        require("@handlers/find_channel_by_name").run(hodnotyout)
        return
    } else if (args[1] < 0) {

        let hodnotyout = ({ zprava: user_language.NEGATIVE_VALUES, roomname: botconfig.find(config => config.name == response).value, message: message })
        require("@handlers/find_channel_by_name").run(hodnotyout)
        return
    }

}


module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases
}