const Discord = require("discord.js");
const { bot } = require('../bot');
const { prefix } = require("../botconfig.json")
const color = require("../colorpaletes/colors.json")
const fs = require("fs");
const noargs = require("../handlers/helpcommand/noargs")
const withargs = require("../handlers/helpcommand/withargs")

const name = "help"
const description = ""
const usage = `${prefix}help pro seznam příkazů nebo ${prefix}help [příkaz] pro konkrétní příkaz`
const accessableby = ["Member"]
const aliases = ["h"]

module.exports.run = async (message, args) => {

    let helpArray = message.content.split(" ");
    let helpArgs = helpArray.slice(1);

    if (!helpArgs[0]) {
        let hodnoty = ({ discord: Discord, fs: fs, prefix: prefix, color: color, message: message })
        noargs.run(hodnoty)
    }
    
    if (helpArgs[0]) {
        let hodnoty = ({ discord: Discord, color: color, message: message, helpargs: helpArgs, bot: bot })
        withargs.run(hodnoty)
    }
}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}