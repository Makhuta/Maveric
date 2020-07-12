const { bot } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const { Guild } = require('discord.js');
const color = require("../colors.json")

bot.on("guildMemberAdd", (member) => {
    bot.channels.fetch(bot.channels.cache.find(c => c.name === botconfig.gateroom).id)
        .then(channel => {
            var d = new Date(member.joinedTimestamp)
            var url = member.user.displayAvatarURL({ format: "png", size: 512 })
            var boturl = bot.user.displayAvatarURL({ format: "png", size: 512 })
            const msg = bot.channels.cache.get(channel.id)
            let welcomemsg = new Discord.MessageEmbed()
                .setTitle(`Vítej ${member.user.username}`)
                .setColor(color.red)
                .setDescription(`
            **Nový člen smečky**
            Právě se k nám přidal **${member.user.username}**
            Discord účet si založil: **${d.toLocaleString('eu')}**
            `)
                .setThumbnail(url)
                .setTimestamp()
                .setFooter(bot.user.username, boturl)
                .setColor(color.red)
            msg.send({ embed: welcomemsg });
        })
})