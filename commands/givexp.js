const { bot, con } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const { Guild } = require('discord.js');
const color = require("../colors/colors.json")
const rankup = require("../funkce/rankup")
const rankdown = require("../funkce/rankdown")
const coinflipcanvas = require("../funkce/coinflipcanvas")
const fs = require('fs')
const mysql = require('mysql')
const random = require('random')

const name = "xp"
const description = `Vypíše počet XP`
const usage = `${botconfig.prefix}xp`
const accessableby = ["Member"]
const aliases = [""]

module.exports.run = async (bot, message, args, con) => {
    let target = message.mentions.users.first();
    let messageauthor = message.author
    
    con.query(`SELECT * FROM userstats WHERE id = '${target.id}'`, (err, rows) => {
        if (err) throw err;



        if (!rows[0]) return message.channel.send("This user has no XP on record.")
        let xp = rows[0].xp
        let level = rows[0].level
        var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
        var callfunction = canvasxp.run
        getrank.run(xp, level, con, target, message, xpToNextLevel, callfunction)
    })
}



module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}