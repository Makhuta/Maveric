const { bot, con } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const { Guild } = require('discord.js');
const color = require("../colors/colors.json")
const Canvas = require('canvas')
const memberjoinxp = 40
const invites = {};

function zprava(level, typek, message, Discord) {
    let embed = new Discord.MessageEmbed()
    embed.addFields({ name: "Level UP", value: typek + " právě postoupil do levlu " + level + "." })
    embed.setColor(color.red)
    message.channel.send(embed)
}

function uvitani(member) {
    bot.channels.fetch(bot.channels.cache.find(c => c.name === botconfig.gateroom).id)
        .then(channel => {
            var d = new Date(member.guild.joinedTimestamp).toLocaleDateString('en').split("/")
            var datum = [d[1], d[0], d[2]].join(". ")
            var url = member.user.displayAvatarURL({ format: "png", size: 512 })
            var boturl = bot.user.displayAvatarURL({ format: "png", size: 512 })
            const msg = bot.channels.cache.get(channel.id)
            let welcomemsg = new Discord.MessageEmbed()
                .setTitle(`Vítej ${member.user.username}`)
                .setColor(color.red)
                .setDescription(`**Nový člen smečky**\nPrávě se k nám přidal **${member.user.username}**\nDiscord účet si založil: **${datum}**`)
                .setThumbnail(url)
                .setTimestamp()
                .setFooter(bot.user.username, boturl)
            msg.send({ embed: welcomemsg });
        })
}

function joinxp(member) {
    // To compare, we need to load the current invite list.
    member.guild.fetchInvites().then(guildInvites => {
        // This is the *existing* invites for the guild.
        const ei = invites[member.guild.id];
        // Update the cached invites for the guild.
        invites[member.guild.id] = guildInvites;
        // Look through the invites, find the one for which the uses went up.
        const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
        // This is just to simplify the message being sent below (inviter doesn't have a tag property)
        const inviter = bot.users.cache.get(invite.inviter.id);
        // Get the log channel (change to your liking)
        const logChannel = member.guild.channels.cache.find(channel => channel.name === botconfig.gateroom);
        // A real basic message with the information we need. 
        //console.log(inviter.id)
        con.query(`SELECT * FROM userstats WHERE id = '${inviter.id}'`, (err, rows) => {
            if (err) throw err;
            //console.log(err + "\n")

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
            //logChannel.send(`${member.user.tag} joined using invite code ${invite.code} from ${inviter.tag}. Invite was used ${invite.uses} times since its creation.`);
        });
    })
}

bot.on('ready', () => {
    // "ready" isn't really ready. We need to wait a spell.
    //wait(1000);
    // Load all invites for all guilds and save them to the cache.
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