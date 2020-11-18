const { con } = require('../bot');
const botconfig = require("../botconfig.json")
const signpost = require("../handlers/ranks/signpost")
const find_channel_by_name = require("../handlers/channelfinder/find_channel_by_name")

const name = "eventxp"
const description = `Přídá členovi počet XP (určeno pro eventy).`
const usage = `${botconfig.prefix}eventxp [@user] [počet XP]`
const accessableby = ["Bulgy", "Admins", "Moderátor", "Eventer"]
const aliases = ["exp"]

function addxp(targetid, targetusername, numofxp, message, target) {
    con.query(`SELECT * FROM userstats WHERE id = '${targetid}'`, (err, rows) => {
        let sql
        var xp = rows[0].xp
        var level = rows[0].level
        xp += numofxp
        var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
        let hodnoty = ({ type: "rankup", sql: sql, con: con, user: target, level: level, xpToNextLevel: xpToNextLevel, xp: xp, message: message })
        signpost.run(hodnoty)
    })
    let hodnotyout = ({ zprava: `${numofxp} XP bylo přičteno uživateli ${targetusername}.`, roomname: require("../botconfig/roomnames.json").botcommand })
    find_channel_by_name.run(hodnotyout)
}


function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}

module.exports.run = async (message, args) => {
    let target = message.mentions.users.first() || message.guild.members.cache.get(args[1]);
    if (target === undefined){

        let hodnotyout = ({ zprava: "Prosím specifukujte uživatele.", roomname: require("../botconfig/roomnames.json").botcommand })
        find_channel_by_name.run(hodnotyout)
        return
    }
    var targetid = target.id
    var targetusername = target.username
    var numofxp = parseInt(args[1])
    if (isInt(args[1]) && args[1] > 0) {
        addxp(targetid, targetusername, numofxp, message, target)
    }
    else if (!isInt(args[1])){

        let hodnotyout = ({ zprava: "Prosím překontrolujte si hodnotu nebo formát XP.", roomname: require("../botconfig/roomnames.json").botcommand })
        find_channel_by_name.run(hodnotyout)
        return
    }

    else if (args[1] < 0){

        let hodnotyout = ({ zprava: "Prosím nepoužívejte záporné hodnoty XP s tímto příkazem.", roomname: require("../botconfig/roomnames.json").botcommand })
        find_channel_by_name.run(hodnotyout)
        return
    }

}


module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}