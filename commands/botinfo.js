const Discord = require("discord.js");
const { prefix, botusername, creatorusername, guildid, youtubeurl } = require("../botconfig.json")
const color = require("../colors.json")
module.exports.run = async (bot, message, args) => {

    var boturl = bot.user.displayAvatarURL({ format: "png", size: 512 })
    var servername = bot.guilds.cache.get(guildid).name

    let botembed = new Discord.MessageEmbed()
        .setTitle("Informace")
        .setColor(color.red)
        .addFields(
            { name: "**Jméno bota**", value: bot.user.username, inline: true },
            { name: "**Bota vytvořil**", value: creatorusername, inline: true },
            { name: "**Youtube channel autora**", value: `[Makhuta](${youtubeurl})`, inline: true },
            { name: "**Účel bota**", value: `${bot.user.username} byl vytvořen na základě snížení náročnosti na správu ${servername} serveru a zajistit snazší interakci uživatelů se serverem.` }
        )
        .setFooter(bot.user.username, boturl)
        .setTimestamp()


    message.channel.send({ embed: botembed });

}

module.exports.help = {
    name: "botinfo",
    description: `Vypíše informace o *${botusername}*ovi`,
    usage: `${prefix}botinfo`,
    accessableby: "Member",
    aliases: ["bi"]
}
