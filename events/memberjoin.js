const { bot, con } = require('../bot');
const Discord = require("discord.js");
const roomnames = require("../botconfig/roomnames.json");
const color = require("../colorpaletes/colors.json")
const { createCanvas, loadImage } = require("canvas");
const { MessageAttachment } = require("discord.js");
const { join } = require("path");
const welcome_canvas = require("../handlers/welcome/welcome_canvas")
const memberjoinxp = 40
const invites = {};

function zprava(level, typek, message, Discord) {
    let embed = new Discord.MessageEmbed()
    embed.addFields({ name: "Level UP", value: typek + " právě postoupil do levlu " + level + "." })
    embed.setColor(color.red)
    message.channel.send(embed)
}

function uvitani(member) {
    bot.channels.fetch(bot.channels.cache.find(c => c.name === roomnames.gateroom).id)
        .then(channel => {
            var d = new Date(member.joinedTimestamp).toLocaleDateString('en').split("/")
            var datum = [d[1], d[0], d[2]].join(". ")
            const msg = bot.channels.cache.get(channel.id)
            let hodnoty = ({ createCanvas: createCanvas, message: msg, join: join, MessageAttachment: MessageAttachment, loadImage: loadImage, color: color, target: member.user, stav: "Welcome", datum: datum })
            welcome_canvas.run(hodnoty)


        })
}

function joinxp(member) {
    member.guild.fetchInvites().then(guildInvites => {
        const ei = invites[member.guild.id];
        invites[member.guild.id] = guildInvites;
        const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
        const inviter = bot.users.cache.get(invite.inviter.id);
        const logChannel = member.guild.channels.cache.find(channel => channel.name === roomnames.gateroom);
        con.query(`SELECT * FROM userstats WHERE id = '${inviter.id}'`, (err, rows) => {
            if (err) throw err;

            let sql
            var xp = rows[0].xp
            var level = rows[0].level
            var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
            if (xp >= xpToNextLevel) {
                level++;
                xp = xp - xpToNextLevel;
                zprava(level, message.author.username, message, Discord)

                sql = `UPDATE userstats SET xp = ${xp + memberjoinxp} WHERE id = '${inviter.id}'`;
                con.query(sql)
                sql = `UPDATE userstats SET level = ${level} WHERE id = '${inviter.id}'`;
                con.query(sql)
            }
            else {
                sql = `UPDATE userstats SET xp = ${xp + memberjoinxp} WHERE id = '${inviter.id}'`;
                con.query(sql)
            }
        });
    })
}

bot.on('ready', () => {
    bot.guilds.cache.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            invites[g.id] = guildInvites;
        });
    });
});

bot.on('guildMemberAdd', member => {
    uvitani(member);
    joinxp(member);

});