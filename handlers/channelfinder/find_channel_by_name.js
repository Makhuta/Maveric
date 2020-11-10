const { bot } = require("../../bot")
const msgzprava = require("../../events/message")

module.exports = {
    run: async (hodnoty) => {
        let zprava = hodnoty.zprava
        let guild = msgzprava.msgzprava.channel.guild
        let message

        if (bot.channels.cache.find(c => c.name === hodnoty.roomname) == undefined) {
            await guild.channels.create(hodnoty.roomname, {
                type: "text"
            })
        }

        await bot.channels.fetch(bot.channels.cache.find(c => c.name === hodnoty.roomname).id)
            .then(async channel => {

                const msg = bot.channels.cache.get(channel.id)



                message = await msg.send(zprava)
            });
        return (message)
    }
}