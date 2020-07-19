const Discord = require("discord.js");
const { prefix } = require("../botconfig.json")
const color = require("../colors.json")
const fs = require("fs");
const { isNumber } = require("util");

module.exports.run = async (bot, message, args) => {
    const numbertodelete = args[0]
    if (numbertodelete !== (null || undefined)) {
        await bot.channels.cache.find(c => c.name === message.channel.name).messages.fetch({ limit: args }).then(messages => {
            bot.channels.cache.find(c => c.name === message.channel.name).bulkDelete(messages)
        })
    }
}


module.exports.help = {
    name: "clean",
    description: `Smaže **X** zpráv.`,
    usage: `${prefix}clean`,
    accessableby: "Bulgy, Admins, Moderátor",
    aliases: ["c"]
}