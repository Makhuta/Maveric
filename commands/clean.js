const { prefix } = require("../botconfig.json")
const { bot } = require("../bot")


const name = "clean"
const description = `Smaže **X** zpráv.`
const usage = `${prefix}clean`
const accessableby = ["Bulgy", "Admins", "Moderátor"]
const aliases = ["c"]

module.exports.run = async (message, args) => {
    const numbertodelete = args[0]
    if (numbertodelete !== (null || undefined)) {
        await bot.channels.cache.find(c => c.name === message.channel.name).messages.fetch({ limit: args }).then(messages => {
            bot.channels.cache.find(c => c.name === message.channel.name).bulkDelete(messages)
        })
    }
}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}