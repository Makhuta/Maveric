const { bot, con } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const { Guild } = require('discord.js');
const color = require("../colors.json")
const rankup_picture = require("../funkce/rankup_picture")
const fs = require('fs')
const mysql = require('mysql')
const random = require('random')

async function rank(xp, level, sql, message, xpToNextLevel) {
    for (xp; xp >= xpToNextLevel; xp) {
        level++;
        xp = xp - xpToNextLevel;

        await rankup_picture.run(message, level)


        sql = `UPDATE userstats SET xp = ${xp} WHERE id = '${message.author.id}'`;
        con.query(sql)
        sql = `UPDATE userstats SET level = ${level} WHERE id = '${message.author.id}'`;
        con.query(sql)
        xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
    }
}

module.exports = {
    async run(message, xp, level, sql, con) {


        var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
        //console.log(xpToNextLevel)

        if (xp >= xpToNextLevel) {
            rank(xp, level, sql, message, xpToNextLevel)
        }
        else {
            sql = `UPDATE userstats SET xp = ${xp} WHERE id = '${message.author.id}'`;
            con.query(sql)
        }

    }
}