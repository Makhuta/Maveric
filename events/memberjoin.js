const { bot } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const { Guild } = require('discord.js');
const color = require("../colors.json")


bot.on("guildMemberAdd", (member) => {
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
})