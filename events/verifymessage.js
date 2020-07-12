const { bot } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const { Guild } = require('discord.js');
const color = require("../colors.json")


bot.on('ready', () => {
    bot.channels.fetch("731565704595374130")
        .then(channel => {
            bot.channels.fetch("706239418893074529")
                .then(channelname => {
                    const msg = bot.channels.cache.get(channel.id)
                    const lastmsg = msg.messages.channel.lastMessageID
                    //console.log(bot.channels.cache.find(c => c.name === channel.name).messages.fetch({limit: 99}))
                    //channel.messages.cacheType
                    //bot.channels.cache.find(c => c.name === channel.name).messages.bulk(lastmsg)
                    //console.log(emoji);
                    var embed = new Discord.MessageEmbed()
                        .setTitle(` __Ověření__ `)
                        .setDescription(`
                Pro přístup k serveru potvrďte že jste si přečetl/a ${channelname} reakcí.
                ↓ ↓ ↓ ↓
            `)
                        .setColor(color.red)
                    //console.log(lastmsg)
                    msg.send(embed)
                    if (!msg.guild.emojis.cache.find(emoji => emoji.name === botconfig.verifyemojiname)) return
                });
        })

    //console.log(msg)
})

bot.on("message", async message => {
    const channel = botconfig.verifyroom
    if (message.channel.id !== bot.channels.cache.find(r => r.name === botconfig.verifyroom).id) return
    const emoji = message.guild.emojis.cache.find(emoji => emoji.name === botconfig.verifyemojiname).id
    message.react(emoji)
    //console.log(bot.channels.cache.find(c => c.name === channel).messages.channel.messages.cache.find(m => m.id === message.id).channel.messages.cache)
})