const Discord = require("discord.js");
const { prefix, botusername, creatorusername, guildid, youtubeurl } = require("../botconfig.json")
const color = require("../colors.json")

const name = "botinfo"
const description = `Vypíše informace o *${botusername}*ovi`
const usage = `${prefix}botinfo`
const accessableby = "Member"
const aliases = ["bi"]

module.exports.run = async (bot, message, args) => {

    var boturl = bot.user.displayAvatarURL({ format: "png", size: 512 })
    var servername = bot.guilds.cache.get(guildid).name
    var botusername = bot.user.username

    let botembed = new Discord.MessageEmbed()
        .setTitle("Informace")
        .setColor(color.red)
        .addFields(
            { name: "**Jméno bota**", value: botusername, inline: true },
            { name: "**Bota vytvořil**", value: `[${creatorusername}](${youtubeurl})`, inline: true },
            { name: "**Účel bota**", value: `${botusername} byl vytvořen na základě snížení náročnosti na správu ${servername} serveru a zajistit snazší interakci uživatelů se serverem.` }
        )
        .setFooter(bot.user.username, boturl)
        .setTimestamp()


    message.channel.send({ embed: botembed });

}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}