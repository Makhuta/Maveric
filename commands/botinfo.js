const { bot } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json")
const color = require("../colorpaletes/colors.json")
const botinfooutput = require("../handlers/botinfo/botinfooutput")


const name = "botinfo"
const description = `Vypíše informace o *${botconfig.botusername}*ovi`
const usage = `${botconfig.prefix}botinfo`
const accessableby = ["Member"]
const aliases = ["bi"]

module.exports.run = async (message) => {
    let hodnoty = ({bot: bot, discord: Discord, botconfig: botconfig, color: color, message: message})
    botinfooutput.run(hodnoty)
}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}