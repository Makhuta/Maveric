const { bot } = require("@src/bot")
const msgzprava = require("@events/message")

module.exports = {
    run: async(hodnoty) => {
        let zprava = hodnoty.zprava
        let guild = hodnoty.message.guild
        let message


        if (guild.channels.cache.find(c => c.name === hodnoty.roomname) == undefined) {
            await guild.channels.create(hodnoty.roomname, {
                type: "text"
            })
        }

        let channel_id = guild.channels.cache.find(c => c.name === hodnoty.roomname).id

        const msg = guild.channels.cache.get(channel_id)


        message = await msg.send(zprava)
        return (message)
    }
}