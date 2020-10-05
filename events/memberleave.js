const { bot } = require('../bot');
const Discord = require("discord.js");
const roomnames = require("../botconfig/roomnames.json");
const color = require("../colorpaletes/colors.json")

bot.on("guildMemberRemove", (member) => {
    bot.channels.fetch(bot.channels.cache.find(c => c.name === roomnames.gateroom).id)
        .then(channel => {
            var d = new Date(member.joinedTimestamp).toLocaleDateString('en').split("/")
            var datum = [d[1], d[0], d[2]].join(". ")
            var url = member.user.displayAvatarURL({ format: "png", size: 512 })
            var boturl = bot.user.displayAvatarURL({ format: "png", size: 512 })
            const msg = bot.channels.cache.get(channel.id)
            let welcomemsg = new Discord.MessageEmbed()
                .setTitle(`Zrádce ${member.user.username}`)
                .setColor(color.red)
                .setDescription(`**Další zrádce**\nPrávě nás zradil/a **${member.user.username}**\nNaším členem byl od: **${datum}**\n`)
                .setThumbnail(url)
                .setTimestamp()
                .setFooter(bot.user.username, boturl)
            msg.send({ embed: welcomemsg });
        })
})