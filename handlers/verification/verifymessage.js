module.exports = {
    run: async (hodnoty) => {
        let bot = hodnoty.bot
        let Discord = hodnoty.discord
        await bot.channels.cache.find(c => c.name === hodnoty.verifyroomname).messages.fetch({ limit: 99 }).then(messages => {
            bot.channels.cache.find(c => c.name === hodnoty.verifyroomname).bulkDelete(messages)
        })

        bot.channels.fetch(bot.channels.cache.find(c => c.name === hodnoty.verifyroomname).id)
            .then(channel => {
                bot.channels.fetch(bot.channels.cache.find(c => c.name === hodnoty.verifyroomname).id)
                    .then(channelname => {
                        const msg = bot.channels.cache.get(channel.id)
                        var embed = new Discord.MessageEmbed()
                            .setTitle(` __Ověření__ `)
                            .setDescription(`
                Pro přístup k serveru potvrďte že jste si přečetl/a ${channelname} reakcí.\n` +
                                `↓ ↓ ↓ ↓`
                            )
                            .setColor(hodnoty.color.red)
                        msg.send(embed)
                        if (!msg.guild.emojis.cache.find(emoji => emoji.name === hodnoty.verifyemojiname)) return
                    });
            })
    }
}