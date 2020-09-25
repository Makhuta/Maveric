const { bot, con } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const { Guild } = require('discord.js');
const color = require("../colors/colors.json")
const rankdown_picture = require("../funkce/rankdown_picture")
const fs = require('fs')
const mysql = require('mysql')
const random = require('random')

async function rank(xp, level, sql, message, xpToNextLevel, target) {
    for (xp; xp < 0; xp) {
        level--;
        xp = xp + xpToNextLevel;

        await rankdown_picture.run(message, level, target)


        sql = `UPDATE userstats SET xp = ${xp} WHERE id = '${target.id || message.author.id}'`;
        con.query(sql)
        sql = `UPDATE userstats SET level = ${level} WHERE id = '${target.id || message.author.id}'`;
        con.query(sql)
        xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
    }
}

module.exports = {
    async run(message, xp, level, sql, con, target) {

        
        var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
        //console.log(xpToNextLevel)
        if (xp < 0) {
            rank(xp, level, sql, message, xpToNextLevel, target)
        }
        else {
            sql = `UPDATE userstats SET xp = ${xp} WHERE id = '${target.id || message.author.id}'`;
            con.query(sql)
        }

    }
}