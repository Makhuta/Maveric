require("module-alias/register");
require("dotenv").config();
const { bot } = require("@src/bot")


const name = "clean"
const accessableby = ["Bulgy", "Admins", "Moderátor"]
const aliases = ["c"]
const category = ["Management", "All"]

module.exports.run = async (message, args) => {
    var numbertodelete = args[0]
    if (numbertodelete > 100) numbertodelete = 100
    if (numbertodelete !== (null || undefined)) {
        await bot.channels.cache.find(c => c.name === message.channel.name).messages.fetch({ limit: numbertodelete }).then(messages => {
            bot.channels.cache.find(c => c.name === message.channel.name).bulkDelete(messages)
        })
    }
}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases,
    category: category
}