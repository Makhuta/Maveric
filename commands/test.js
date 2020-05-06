const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {

    message.channel.send("This is test!");

}

module.exports.help = {
    name: "test"
}