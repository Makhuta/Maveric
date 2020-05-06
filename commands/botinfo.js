const Discord = require("discord.js");
module.exports.run = async (bot, msg, args) => {

    let botembed = new Discord.MessageEmbed()
        .setTitle("Bot Information")
        .setColor("#15f153")
        .addField("Bot Name", bot.user.username);

    msg.channel.send(botembed);

}

module.exports.help = {
    name: "botinfo"
}