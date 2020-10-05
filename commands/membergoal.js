const { bot } = require('../bot');
const botconfig = require("../botconfig.json")
const goalcanvas = require("../handlers/guild/goalcanvas")

const name = "membergoal"
const description = `Ukáže kolik zbývá do dalšího member goalu.`
const usage = `${botconfig.prefix}${name}`
const accessableby = ["Member"]
const aliases = ["mg"]

module.exports.run = async (message) => {
    const guild = bot.guilds.cache.get(botconfig.guildid)
    goalcanvas.run(message, guild)
}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}