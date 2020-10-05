const { con } = require('../bot');
const botconfig = require("../botconfig.json")
const signpost = require("../handlers/ranks/signpost")

const name = "eventxp"
const description = `Přídá členovi počet XP`
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
        //console.log(xpToNextLevel)
        let hodnoty = ({ type: "rankup", sql: sql, con: con, user: target, level: level, xpToNextLevel: xpToNextLevel, xp: xp, message: message })
        signpost.run(hodnoty)
    })
    message.channel.send(`${numofxp} XP bylo přičteno uživateli ${targetusername}.`)
}


function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}

module.exports.run = async (message, args) => {
    let target = message.mentions.users.first() || message.guild.members.cache.get(args[1]);
    if (target === undefined) return message.channel.send("Prosím specifukujte uživatele.")
    var targetid = target.id
    var targetusername = target.username
    var numofxp = parseInt(args[1])
    //console.log(numofxp)
    if (isInt(args[1]) && args[1] > 0) {
        //console.log(targetid)
        addxp(targetid, targetusername, numofxp, message, target)
    }
    else if (!isInt(args[1])) return message.channel.send("Prosím překontrolujte si hodnotu nebo formát XP.")
    else if (args[1] < 0) return message.channel.send("Prosím nepoužívejte záporné hodnoty XP s tímto příkazem.")
}


module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}