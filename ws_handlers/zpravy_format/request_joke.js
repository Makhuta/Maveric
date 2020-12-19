const color = require("../../colorpaletes/colors.json")
const Discord = require("discord.js");
const find_channel_by_name = require("../../handlers/channelfinder/find_channel_by_name")

module.exports = {
    async run(hodnoty) {
        var zanr = hodnoty.req.body.zanr
        var vtip = hodnoty.req.body.vtip
        var roomname = hodnoty.req.body.channel

        if (zanr.length == 0 || vtip.length == 0) return

        var embed = new Discord.MessageEmbed()
            .setAuthor(zanr)
            .setDescription(vtip)
            .setColor(color.red)

        let hodnoty_out = ({ roomname: roomname, zprava: embed })
        find_channel_by_name.run(hodnoty_out)
    }
}