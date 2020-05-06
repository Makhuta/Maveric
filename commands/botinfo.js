const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {

    let botembed = new Discord.MessageEmbed()
        .setTitle("Bot Information")
        .setColor("#15f153")
        .addField("Bot Name", bot.user.username);

    message.channel.send({embed: botembed});
    message.channel.send("test folder");

}

module.exports.help = {
    name: "botinfo"
}
