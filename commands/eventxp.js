const { bot, con } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json")
const color = require("../colors/colors.json")
const fs = require("fs");
const rankup = require("../funkce/rankup")

const name = "eventxp"
const description = `Přídá členovi počet XP`
const usage = `${botconfig.prefix}eventxp [@user] [počet XP]`
const accessableby = ["Bulgy", "Admins", "Moderátor", "Eventer"]
const aliases = ["exp"]

function addxp(targetid, targetusername, numofxp, message) {
    con.query(`SELECT * FROM userstats WHERE id = '${targetid}'`, (err, rows) => {
        let sql
        var xp = rows[0].xp
        var level = rows[0].level
        xp += numofxp
        var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
        //console.log(xpToNextLevel)
        rankup.run(message, xp, level, sql, con)
    })
    message.channel.send(`${numofxp} XP bylo přičteno uživateli ${targetusername}.`)
}

function zprava(level, typek, message) {
    let embed = new Discord.MessageEmbed()
    embed.addFields({ name: "Level UP", value: typek + " právě postoupil do levlu " + level + "." })
    embed.setColor(color.red)
    message.channel.send(embed)
}

function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}

module.exports.run = async (bot, message, args, con) => {
    let target = message.mentions.users.first() || message.guild.members.cache.get(args[1]);
    if(target === undefined) return message.channel.send("Prosím specifukujte uživatele.")
    var targetid = target.id
    var targetusername = target.username
    var numofxp = parseInt(args[1])
    //console.log(numofxp)
    if (isInt(args[1]) && args[1] > 0) {
        //console.log(targetid)
        addxp(targetid, targetusername, numofxp, message)
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