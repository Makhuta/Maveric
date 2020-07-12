const Discord = require("discord.js");
const { prefix, botusername, creatorusername } = require("../botconfig.json")
const color = require("../colors.json")
module.exports.run = async (bot, message, args) => {

    let botembed = new Discord.MessageEmbed()
        .setTitle("Informace")
        .setColor(color.red)
        .setDescription(`
            - **Jméno bota** ${bot.user.username}
            - **Bota vytvořil** ${creatorusername}
            `)
            .setFooter(bot.user.username)


    message.channel.send({ embed: botembed });

}

module.exports.help = {
    name: "botinfo",
    description: `Vypíše informace o *${botusername}*ovi`,
    usage: `${prefix}botinfo`,
    accessableby: "Member",
    aliases: ["bi"]
}
