const color = require("../../colorpaletes/colors.json")
const Discord = require("discord.js");

module.exports = {
    async run(hodnoty) {
        let zanr = hodnoty.zanr
        let vtip = hodnoty.vtip

        var embed = new Discord.MessageEmbed()
            .setAuthor(zanr)
            .setDescription(vtip)
            .setColor(color.red)
        return embed
    }
}