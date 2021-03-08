//Must be on the top of every code for accessing folders more easilly
require("module-alias/register");
require("dotenv").config();


const { bot, pool } = require('@src/bot');
const Discord = require("discord.js");
//const roomnames = require("../botconfig/roomnames.json");
const color = require("@colorpaletes/colors.json")
const { createCanvas, loadImage } = require("canvas");
const { MessageAttachment } = require("discord.js");
const { join } = require("path");
const welcome_canvas = require("@canvases/welcome_canvas")
const moment = require("moment")
const botconfig = require("@events/load_config_from_database");

function zprava(level, typek, message, Discord) {
    let embed = new Discord.MessageEmbed()
    embed.addFields({ name: "Level UP", value: typek + " právě postoupil do levlu " + level + "." })
    embed.setColor(color.red)
    message.channel.send(embed)
}

function uvitani(member) {
    bot.channels.fetch(botconfig.filter(config => config.name == "GATEROOM")[0].value)
        .then(channel => {
            var datum = moment(member.user.createdAt).format('l').split("/")
            datum = [datum[1], datum[0], datum[2]].join(". ")
            console.log(datum)
            const msg = bot.channels.cache.get(channel.id)
            let hodnoty = ({ createCanvas: createCanvas, message: msg, join: join, MessageAttachment: MessageAttachment, loadImage: loadImage, color: color, target: member.user, stav: "Welcome", datum: datum })
            welcome_canvas.run(hodnoty)


        })
}

function add_user(member) {
    pool.getConnection(async function(err, con) {
        if (err) throw err;
        sql = `INSERT INTO userstats (id) VALUES ('${member.id}')`
        con.query(sql)
        console.log(`ADDED ${member.user.username}!`)
    })
}

async function member_role(member) {
    let role = member.guild.roles.cache.find(role => role.name === "Member");
    member.roles.add(role).catch(console.error);
    /*let muted_role = member.guild.roles.cache.find(role => role.name === "Muted");
    console.log(muted_role)
    if (member.roles.has(muted_role.id)) {
        member.roles.remove(muted_role.id)
    }*/
}

bot.on('guildMemberAdd', member => {
    uvitani(member);
    add_user(member);
    member_role(member);

});