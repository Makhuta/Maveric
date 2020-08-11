const Discord = require("discord.js");
const botconfig = require("../botconfig.json")
const color = require("../colors.json")
const fs = require("fs");

const name = "xp"
const description = `Vypíše počet XP`
const usage = `${botconfig.prefix}xp`
const accessableby = ["Member"]
const aliases = [""]

function zprava(xp, level, message, Discord, xpToNextLevel) {
    let embed = new Discord.MessageEmbed()
    embed.addFields({name: "Statistiky uživatele "+ message.author.username, value: "Tvůj Level je " + level + "\nTvoje XP jsou " + xp + "/" + xpToNextLevel})
    embed.setColor(color.red)
    message.channel.send(embed)
}

module.exports.run = async (bot, message, args, con) => {
let target = message.mentions.users.first () || message.guild.members.cache.get(args[1]) || message.author;

con.query(`SELECT * FROM userstats WHERE id = '${target.id}'`, (err, rows) => {
    if(err) throw err;

    if(!rows[0]) return message.channel.send("This user has no XP on record.")
    let xp = rows[0].xp
    let level = rows[0].level
    var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
    zprava(xp, level, message, Discord, xpToNextLevel)
})
}


module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}