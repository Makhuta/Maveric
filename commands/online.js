const Discord = require("discord.js");
const {prefix} = require("../botconfig.json")
const color = require("../colors/colors.json")

const name = "online"
const description = ""
const usage = `${prefix}online`
const accessableby = ["Bulgy", "Admins"]
const aliases = ["o"]

module.exports.run = async (bot, message, args) => {

    message.channel.send("I am fully online sir.");

}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}