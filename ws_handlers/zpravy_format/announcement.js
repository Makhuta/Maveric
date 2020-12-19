const color = require("../../colorpaletes/colors.json")
const Discord = require("discord.js");
const find_channel_by_name = require("../../handlers/channelfinder/find_channel_by_name")
const passwords = require("../../events/local_database").passwords
const { bot } = require("../../bot")

module.exports = {
    async run(hodnoty) {
        var ID = hodnoty.req.body.ID
        var password = hodnoty.req.body.password
        var zprava = hodnoty.req.body.zprava
        var roomname_id = hodnoty.req.body.channel
        var roomname = bot.channels.cache.get(roomname_id).name
        var rows = passwords.rows
        var id_list = []
        var password_list = []
        var tier_list = []
        var rows_list = []

        rows.forEach(row => {
            id_list.push(row.user_id)
            password_list.push(row.password)
            tier_list.push(row.tier)
            rows_list.push({ id: row.user_id, password: row.password, username: row.username, tier: row.tier })
        });

        if (!id_list.includes(ID)) return

        let selected_user = rows_list.find(user => user.id == ID)

        if (selected_user.password != password) return

        if (selected_user.tier < 5) return

        var find_user = bot.users.cache.find(user => user.id == selected_user.id)
        var user_username = find_user.tag
        var user_avatar = find_user.avatarURL()


        var embed = new Discord.MessageEmbed()
            .setTitle("Oznámení")
            .setDescription(zprava)
            .setColor(color.red)
            .setFooter(user_username, user_avatar)

        let hodnoty_out = ({ roomname: roomname, zprava: embed })
        find_channel_by_name.run(hodnoty_out)
    }
}