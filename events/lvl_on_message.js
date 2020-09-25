const { bot, con } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const { Guild } = require('discord.js');
const color = require("../colors/colors.json")
const rankup_picture = require("../funkce/rankup_picture")
const rankup = require("../funkce/rankup")
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
            var target = message.author

            if (Date.now() - lastmsg > 60000) {
                xp += generateXP()

                rankup.run(message, xp, level, sql, con, target)
                sql = `UPDATE userstats SET last_message = ${cas} WHERE id = '${message.author.id}'`;
                con.query(sql)
            }
            else return
            //console.log(level + " " + xp)
        }

        //console.log(rows)
    })
}

bot.on("message", message => {
    if (message.author.bot || message.channel.type === "dm" || message.content.startsWith(botconfig.prefix)) return
    databaze(message, con);

})