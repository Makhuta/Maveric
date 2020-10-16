const { bot } = require("../../bot")

module.exports = {
    run: (hodnoty) => {
        let zprava = hodnoty.zprava


        bot.channels.fetch(bot.channels.cache.find(c => c.name === hodnoty.roomname).id)
            .then(channel => {
                const msg = bot.channels.cache.get(channel.id)


                msg.send(zprava)
            });

    }
}