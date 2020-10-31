const { bot } = require("../../bot")

module.exports = {
    run: async (hodnoty) => {
        let zprava = hodnoty.zprava

        let message


        await bot.channels.fetch(bot.channels.cache.find(c => c.name === hodnoty.roomname).id)
            .then(async channel => {
                const msg = bot.channels.cache.get(channel.id)


                message = await msg.send(zprava)
            });
        return (message)
    }
}