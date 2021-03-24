require("module-alias/register");
require("dotenv").config();
const { bot } = require('@src/bot');
const Discord = require("discord.js");
const color = require("@colorpaletes/colors.json")


const name = "botinfo"
const accessableby = ["Member"]
const aliases = ["bi"]
const response = "COMMAND_ROOM_NAME"
const category = ["Info", "All"]

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    var boturl = bot.user.displayAvatarURL({ format: "png", size: 512 })
    var servername = bot.guilds.cache.first().name
    var botusername = bot.user.username
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("BOTINFO")

    let botembed = new Discord.MessageEmbed()
        .setTitle(user_language.INFO)
        .setColor(color.red)
        .addFields({ name: user_language.BOT_USERNAME, value: botusername, inline: true }, { name: user_language.BOT_CREATOR, value: `[${botconfig.find(config => config.name == "CREATOR_USERNAME").value}](${botconfig.find(config => config.name == "CREATOR_YT_CHANNEL").value})`, inline: true }, { name: user_language.BOT_FUNC, value: user_language.BOT_FUNC_TEXT.replace("&BOTUSERNAME", botusername).replace("&SERVERNAME", servername) })
        .setFooter(bot.user.username, boturl)
        .setTimestamp()

    let hodnotyout = ({ zprava: botembed, roomname: botconfig.find(config => config.name == response).value, message: message })
    require("@handlers/find_channel_by_name").run(hodnotyout)
}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases,
    category: category
}