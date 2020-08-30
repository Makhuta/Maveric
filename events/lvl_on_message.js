const { bot, con } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const { Guild } = require('discord.js');
const color = require("../colors.json")
const mysqlconfig = require("../mysqlconfig.json")
const fs = require('fs')
const mysql = require('mysql')
const random = require('random')

function generateXP() {
    return random.int(10, 30)
}

function zprava(level, typek, message, Discord) {
    let embed = new Discord.MessageEmbed()
    embed.addFields({ name: "Level UP", value: typek + " právě postoupil do levlu " + level + "." })
    embed.setColor(color.red)
    message.channel.send(embed)
}

function databaze(message, con) {
    con.query(`SELECT * FROM userstats WHERE id = '${message.author.id}'`, (err, rows) => {
        if (err) throw err;
        //console.log(err + "\n")

        let sql
        //console.log(`\n${rows}\n`)
        if (rows.length < 1) {
            //console.log("prvni")
            sql = `INSERT INTO userstats (id, xp) VALUES ('${message.author.id}', ${generateXP()})`
            con.query(sql)
        }
        else {
            var xp = rows[0].xp
            var level = rows[0].level
            var lastmsg = rows[0].last_message
            var cas = Date.now()

            if (Date.now() - lastmsg > 1000) {
                xp += generateXP()
                var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
                //console.log(xpToNextLevel)
                if (xp >= xpToNextLevel) {
                    level++;
                    xp = xp - xpToNextLevel;
                    zprava(level, message.author.username, message, Discord)

                    sql = `UPDATE userstats SET xp = ${xp} WHERE id = '${message.author.id}'`;
                    con.query(sql)
                    sql = `UPDATE userstats SET allxp = ${allxp(level, xp, sql, message)} WHERE id = '${message.author.id}'`;
                    con.query(sql)
                    sql = `UPDATE userstats SET level = ${level} WHERE id = '${message.author.id}'`;
                    con.query(sql)
                    sql = `UPDATE userstats SET last_message = ${cas} WHERE id = '${message.author.id}'`;
                    con.query(sql)
                }
                else {
                    sql = `UPDATE userstats SET xp = ${xp} WHERE id = '${message.author.id}'`, `UPDATE userstats SET last_message = ${cas} WHERE id = '${message.author.id}'`;
                    con.query(sql)
                    sql = `UPDATE userstats SET allxp = ${allxp(level, xp, sql, message)} WHERE id = '${message.author.id}'`;
                    con.query(sql)
                    sql = `UPDATE userstats SET last_message = ${cas} WHERE id = '${message.author.id}'`;
                    con.query(sql)
                }
            }
            else return
            //console.log(level + " " + xp)
        }

        //console.log(rows)
    })
}

function allxp(level, xp, sql, message) {
    var xpecka = xp
    for (let l = 0; l < level; l++) {
        var xpToNextLevel = 5 * Math.pow(l, 2) + 50 * l + 100;
        xpecka = xpecka + xpToNextLevel;
    }
    sql = `UPDATE userstats SET allxp = ${xpecka} WHERE id = '${message.author.id}'`;
    con.query(sql)
    return
}

bot.on("message", message => {
    if (message.author.bot || message.channel.type === "dm" || message.content.startsWith(botconfig.prefix)) return
    databaze(message, con);

})