require("module-alias/register");
require("dotenv").config();
const Discord = require("discord.js");
const { bot } = require('@src/bot');
const color = require("@colorpaletes/colors.json")
const fs = require("fs");
const categories = require("@configs/command_categories.json")


const name = "help"
const accessableby = ["Member"]
const aliases = ["h"]
const response = "COMMAND_ROOM_NAME";
const category = "Info"

function noargs(hodnoty) {
    let message = hodnoty.message
    let command
    let prefix = hodnoty.prefix
    let list_of_commands = []
    let separated_list_of_commands = []
    let user_lang_role = hodnoty.user_lang_role
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("HELP").noargs
    fs.readdir("./commands/", (err, files) => {

        var embed = new Discord.MessageEmbed()
        embed.setAuthor(user_language.AUTHOR)


        for (var i = 0; i < files.length; i++) {
            let prikaz = files[i]
            prikaz = prikaz.replace(".js", "")
            command = bot.commands.get(prikaz);
            list_of_commands.push({ name: command.help.name, category: command.help.category || "Undefined Category" })
        }

        let commands_categories_list = []
        list_of_commands.forEach(cmd => {
            if (!commands_categories_list.includes(cmd.category)) {
                commands_categories_list.push(cmd.category)
            }
        })
        let commands_categories_length = commands_categories_list.length
        console.log(`Number of categories: ${commands_categories_length}\nCategories list: ${commands_categories_list.join(", ")}`)

        categories.forEach(con_category => {
            let filtered_category_cmd = list_of_commands.filter(cmd => cmd.category == con_category)
            let commands_names = filtered_category_cmd.map(function(obj) {
                return obj.name
            })
            if (commands_names.length == 0) commands_names = ["No commands in category."]
            separated_list_of_commands.push({ category: `**${con_category}**`, names: commands_names.join(", ") })
        });

        let seznamjs = separated_list_of_commands.join('\n\n')
        console.log(list_of_commands)

        separated_list_of_commands.forEach(cmd => {
            embed.addFields({ name: cmd.category, value: cmd.names, inline: true })
        })

        //embed.setDescription(seznamjs)
        embed.addFields({ name: user_language.FIELDS[0].NAME, value: user_language.FIELDS[0].VALUE.replace("&PREFIX", hodnoty.prefix) }, { name: user_language.FIELDS[1].NAME, value: user_language.FIELDS[1].VALUE.replace("&PREFIX", hodnoty.prefix) }, { name: user_language.FIELDS[2].NAME, value: user_language.FIELDS[2].VALUE.replace("&PREFIX", hodnoty.prefix) })
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
            .addFields({ name: user_language.FIELDS[0].NAME, value: user_command_language_description_and_usage.DESCRIPTION.replace("&PREFIX", hodnoty.prefix).replace("&BOTUSERNAME", bot.user.username) || user_language.NO_DESCRIPTION }, { name: user_language.FIELDS[1].NAME, value: user_command_language_description_and_usage.USAGE.replace("&PREFIX", hodnoty.prefix) }, { name: user_language.FIELDS[2].NAME, value: command.help.accessableby.join(", ") }, { name: user_language.FIELDS[3].NAME, value: command.help.aliases.join(", ") || user_language.NO_ALIAS })
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
    aliases: aliases,
    category: category
}