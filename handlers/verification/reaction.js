module.exports = {
    run: async (hodnoty) => {
        let bot = hodnoty.bot
        let message = hodnoty.message
        if (message.channel.id !== bot.channels.cache.find(r => r.name === hodnoty.verifyroomname).id) return
        const emoji = message.guild.emojis.cache.find(emoji => emoji.name === hodnoty.verifyemojiname).id
        message.react(emoji)
    }
}