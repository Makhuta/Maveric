//Must be on the top of every code for accessing folders more easilly
require("module-alias/register");
require("dotenv").config();



const { bot, pool } = require('@src/bot');
const { createCanvas, loadImage } = require("canvas");
const welcome_canvas = require("@canvases/welcome_canvas")
const { join } = require("path");
const { MessageAttachment } = require("discord.js");
const color = require("@colorpaletes/colors.json")
const botconfig = require("@events/load_config_from_database");

function remove_user(member) {
    pool.getConnection(async function(err, con) {
        if (err) throw err;
        sql = `DELETE FROM userstats WHERE id='${member.id}'`
        con.query(sql)
        console.log(`REMOVED ${member.user.username}!`)
    })
}

bot.on("guildMemberRemove", (member) => {
    bot.channels.fetch(botconfig.filter(config => config.name == "GATEROOM")[0].value)
        .then(channel => {
            var d = new Date(member.joinedTimestamp).toLocaleDateString('en').split("/")
            var datum = [d[1], d[0], d[2]].join(". ")
            const msg = bot.channels.cache.get(channel.id)
            let hodnoty = ({ createCanvas: createCanvas, message: msg, join: join, MessageAttachment: MessageAttachment, loadImage: loadImage, color: color, target: member.user, stav: "Traitor", datum: datum })
            welcome_canvas.run(hodnoty)
        })
    remove_user(member)
})