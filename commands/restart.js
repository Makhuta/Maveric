const Discord = require("discord.js");
const { prefix, verifyroom, pravidlaroom, verifyemojiname} = require("../botconfig.json")
const color = require("../colors.json")

const name = "restart"
const description = `Tento příkaz pro restartování a nastavení ${verifyroom} bota.`
const usage = `${prefix}restart`
const accessableby = "Bulgy, Admins"
const aliases = ["r"]

module.exports.run = async (bot, message, args) => {
    await bot.channels.cache.find(c => c.name === verifyroom).messages.fetch({ limit: 99 }).then(messages => {
        bot.channels.cache.find(c => c.name === verifyroom).bulkDelete(messages)
    })

    bot.channels.fetch(bot.channels.cache.find(c => c.name === verifyroom).id)
        .then(channel => {
            bot.channels.fetch(bot.channels.cache.find(c => c.name === pravidlaroom).id)
                .then(channelname => {
                    const msg = bot.channels.cache.get(channel.id)
                    const lastmsg = msg.messages.channel.lastMessageID
                    var embed = new Discord.MessageEmbed()
                        .setTitle(` __Ověření__ `)
                        .setDescription(`
                Pro přístup k serveru potvrďte že jste si přečetl/a ${channelname} reakcí.
                ↓ ↓ ↓ ↓
            `)
                        .setColor(color.red)
                    msg.send(embed)
                    if (!msg.guild.emojis.cache.find(emoji => emoji.name === verifyemojiname)) return
                });
        })
}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}