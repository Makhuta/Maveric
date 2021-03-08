require("module-alias/register");
require("dotenv").config();
const Discord = require("discord.js");
const { bot } = require('@src/bot');
const color = require("@colorpaletes/colors.json")
const fs = require("fs");

const name = "help"
const accessableby = ["Member"]
const aliases = ["h"]
const response = "COMMAND_ROOM_NAME";

function noargs(hodnoty) {
    let message = hodnoty.message
    let command
    let prefix = hodnoty.prefix
    let list_of_commands = []
    let user_lang_role = hodnoty.user_lang_role
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("HELP").noargs
    fs.readdir("./commands/", (err, files) => {

        var embed = new Discord.MessageEmbed()
        embed.setAuthor(user_language.AUTHOR)


        for (var i = 0; i < files.length; i++) {
            let prikaz = files[i]
            prikaz = prikaz.replace(".js", "")
            command = bot.commands.get(prikaz);
            list_of_commands.push(command.help.name)
        }

        let seznamjs = list_of_commands.join(', ')

        embed.setDescription(seznamjs)
        embed.addFields({ name: user_language.FIELDS[0].NAME, value: user_language.FIELDS[0].VALUE.replace("&PREFIX", hodnoty.prefix), inline: true }, { name: user_language.FIELDS[1].NAME, value: user_language.FIELDS[1].VALUE.replace("&PREFIX", hodnoty.prefix) }, { name: user_language.FIELDS[2].NAME, value: user_language.FIELDS[2].VALUE.replace("&PREFIX", hodnoty.prefix) })
        embed.setColor(color.aqua)

        let hodnotyout = ({ zprava: embed, roomname: hodnoty.botconfig.find(config => config.name == response).value, message: message })
        require("@handlers/find_channel_by_name").run(hodnotyout)
    })
}

function withargs(hodnoty) {
    let helpArgs = hodnoty.helpargs
    let message = hodnoty.message
    let command = helpArgs[0];

    let user_lang_role = hodnoty.user_lang_role
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("HELP").withargs


    if (bot.commands.get(command) || bot.commands.get(bot.aliases.get(command))) {

        command = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command));
        let command_name = command.help.name
        let user_command_language_description_and_usage = require("@events/language_load").languages.get(user_lang_role).get(command_name.toUpperCase())
        //console.log(user_command_language_description_and_usage)
        var embed = new Discord.MessageEmbed()
            .setAuthor(user_language.AUTHOR.replace("&COMMAND_NAME", command.help.name))
            .addFields({ name: user_language.FIELDS[0].NAME, value: user_command_language_description_and_usage.DESCRIPTION.replace("&PREFIX", hodnoty.prefix).replace("&BOTUSERNAME", bot.user.username) || user_language.NO_DESCRIPTION }, { name: user_language.FIELDS[1].NAME, value: user_command_language_description_and_usage.USAGE.replace("&PREFIX", hodnoty.prefix) || user_language.NO_USAGE }, { name: user_language.FIELDS[2].NAME, value: command.help.accessableby.join(", ") }, { name: user_language.FIELDS[3].NAME, value: command.help.aliases })
            .setColor(color.lime)

        let hodnotyout = ({ zprava: embed, roomname: hodnoty.botconfig.find(config => config.name == response).value, message: message })
        require("@handlers/find_channel_by_name").run(hodnotyout)
    }
}

module.exports.run = async(message, args, botconfig, user_lang_role) => {

    let helpArray = message.content.split(" ");
    let helpArgs = helpArray.slice(1);
    let prefix = botconfig.filter(config => config.name == "PREFIX")[0].value

    if (!helpArgs[0]) {
        let hodnoty = ({ prefix: prefix, message: message, user_lang_role: user_lang_role, botconfig: botconfig })
        noargs(hodnoty)
    }

    if (helpArgs[0]) {
        let hodnoty = ({ prefix: prefix, message: message, helpargs: helpArgs, user_lang_role: user_lang_role, botconfig: botconfig })
        withargs(hodnoty)
    }
}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases
}