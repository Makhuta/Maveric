const Discord = require("discord.js");
const {prefix} = require("../botconfig.json")
const color = require("../colors.json")
module.exports.run = async (bot, message, args) => {

    message.channel.send("I am fully online sir.");

}

module.exports.help = {
    name: "online",
    description: "",
    usage: `${prefix}online`,
    accessableby: "Bulgy, Admins",
    aliases: ["o"]
}