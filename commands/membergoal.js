const { bot, con } = require('../bot');
const { MessageAttachment } = require("discord.js");
const botconfig = require("../botconfig.json")
const color = require("../colors.json")
const fs = require("fs");
const { createCanvas, loadImage, Canvas } = require("canvas");
const { join } = require("path");
const { createGzip } = require("zlib");
const goalcanvas = require("../funkce/goalcanvas")

const name = "membergoal"
const description = `Vypíše počet XP`
const usage = `${botconfig.prefix}xp`
const accessableby = ["Member"]
const aliases = ["mg"]

module.exports.run = async (bot, message, args, con) => {
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