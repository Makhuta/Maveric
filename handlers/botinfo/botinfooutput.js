const find_channel_by_name = require("../channelfinder/find_channel_by_name")

module.exports = {
    run: (hodnoty) => {
        let bot = hodnoty.bot
        let Discord = hodnoty.discord
        let guildid = hodnoty.botconfig.guildid
        let color = hodnoty.color
        let creatorusername = hodnoty.botconfig.creatorusername
        let youtubeurl = hodnoty.botconfig.youtubeurl
        let message = hodnoty.message

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

        let hodnotyout = ({ zprava: botembed, roomname: require("../../botconfig/roomnames.json").botcommand })
        find_channel_by_name.run(hodnotyout)
    }
}