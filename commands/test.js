const Discord = require("discord.js");
const {prefix} = require("../botconfig.json")
const color = require("../colors.json")
module.exports.run = async (bot, message, args) => {

    message.channel.send("This is test!");
    //message.guild.member(user).add(role)
    console.log(message.channel.guild.members)

}

module.exports.help = {
    name: "test",
    description: "Tento příkaz je jen pro budoucí testování bota.",
    usage: `${prefix}test`,
    accessableby: "Bulgy, Admins",
    aliases: ["t"]
}