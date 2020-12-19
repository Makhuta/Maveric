const { bot } = require("../../../bot")


module.exports = {
    async run(hodnoty) {
        let res = hodnoty.res
        let view_hbs = hodnoty.view_hbs
        let title = hodnoty.title
        let host_value = hodnoty.host_value

        let guild = bot.guilds.cache.first()
        let channels = guild.channels.cache.filter(channel => channel.type == "text")

        let channels_ids = []
        channels.forEach(channel => {
            channels_ids.push({ id: channel.id, name: channel.name })
        })

        //console.log(channels_ids)


        res.render(view_hbs, { title: title, host_value: host_value, public_list: hodnoty.public_list, token: hodnoty.token, channels_ids: channels_ids });
    }
}