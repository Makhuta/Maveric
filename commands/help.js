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
const category = ["Info", "All"]

async function json_of_cmds_help() {
    let files = await new Promise((resolve, reject) => {
        return fs.readdir('./commands/', (err, filenames) => err != null ? reject(err) : resolve(filenames))
    })
    var result = []
    for (var i = 0; i < files.length; i++) {
        let prikaz = files[i]
        prikaz = prikaz.replace(".js", "")
        command = bot.commands.get(prikaz);
        result.push(command.help)
    }
    return result
}

async function get_all_categories() {
    let commands = await json_of_cmds_help()
    commands = commands.filter(cmd => cmd.category != "Hidden" && cmd.category != "Undefined Category")
    let all_categories = { normal: [], lower_case: [] }
    commands.forEach(cmd => {
        //console.log(cmd)
        cmd.category.forEach(category_name => {
            if (!all_categories.normal.includes(category_name) && category_name != "Undefined Category" && category_name != "Hidden" && category_name) {
                all_categories.normal.push(category_name)
                all_categories.lower_case.push(category_name.toLowerCase())
            }
        })
    })
    return all_categories
}

function noargs(hodnoty) {
    let message = hodnoty.message
    let command
    let prefix = hodnoty.prefix
    let separated_list_of_commands = []
    let user_lang_role = hodnoty.user_lang_role
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("HELP").noargs
    fs.readdir("./commands/", async(err, files) => {
        //console.log(await json_of_cmds_help())
        var embed = new Discord.MessageEmbed()
        embed.setAuthor(user_language.AUTHOR)

        let list_of_commands = await json_of_cmds_help()

        let commands_categories_list = await get_all_categories()
            /*list_of_commands.forEach(cmd => {
                if (!commands_categories_list.includes(cmd.category)) {
                    commands_categories_list.push(cmd.category)
                }
            })*/
        let commands_categories_length = commands_categories_list.length
            //console.log(`Number of categories: ${commands_categories_length}\nCategories list: ${commands_categories_list.join(", ")}`)

        /*commands_categories_list.normal.forEach(con_category => {
            let filtered_category_cmd = list_of_commands.filter(cmd => cmd.category == con_category)
            let commands_names = filtered_category_cmd.map(function(obj) {
                return obj.name
            })
            if (commands_names.length == 0) commands_names = ["No commands in category."]
            separated_list_of_commands.push({ category: `**${con_category}**`, names: commands_names.join(", ") })
        });

        
        //console.log(list_of_commands)

        separated_list_of_commands.forEach(cmd => {
            embed.addFields({ name: cmd.category, value: cmd.names, inline: true })
        })*/
        let seznamjs = commands_categories_list.normal.join(', ')
        embed.setDescription(seznamjs)
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

function categoryargs(hodnoty) {
    let req_category = hodnoty.req_category
    let message = hodnoty.message
    let command
    let prefix = hodnoty.prefix
    let separated_list_of_commands = []
    let user_lang_role = hodnoty.user_lang_role
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("HELP").categoryargs
    fs.readdir("./commands/", async(err, files) => {
        //console.log(await json_of_cmds_help())
        var embed = new Discord.MessageEmbed()
        embed.setAuthor(user_language.AUTHOR)

        let list_of_commands = await json_of_cmds_help()

        let commands_categories_list = await get_all_categories()
            /*list_of_commands.forEach(cmd => {
                if (!commands_categories_list.includes(cmd.category)) {
                    commands_categories_list.push(cmd.category)
                }
            })*/
        let commands_categories_length = commands_categories_list.length
            //console.log(`Number of categories: ${commands_categories_length}\nCategories list: ${commands_categories_list.join(", ")}`)


        let filtered_category_cmd = list_of_commands.filter(cmd => cmd.category.includes(req_category))
        let commands_names = filtered_category_cmd.map(function(obj) {
            return obj.name
        })
        if (commands_names.length == 0) commands_names = ["No commands in category."]
        separated_list_of_commands.push({ category: `**${req_category}**`, names: commands_names.join(", ") })

        //let seznamjs = separated_list_of_commands.join('\n\n')
        //console.log(list_of_commands)

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

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    let commands_categories_list = await get_all_categories()
        //commands_categories_list = commands_categories_list.toLowerCase();
    //console.log(commands_categories_list)

    let helpArray = message.content.split(" ");
    let helpArgs = helpArray.slice(1);
    let prefix = botconfig.filter(config => config.name == "PREFIX")[0].value

    if (!helpArgs[0]) {
        let hodnoty = ({ prefix: prefix, message: message, user_lang_role: user_lang_role, botconfig: botconfig })
        noargs(hodnoty)
    } else if (commands_categories_list.lower_case.includes(helpArgs[0].toLowerCase())) {
        //console.log("Category")
        let ctgr = commands_categories_list.normal[commands_categories_list.lower_case.indexOf(helpArgs[0].toLowerCase())]
        let hodnoty = ({ prefix: prefix, message: message, req_category: ctgr, user_lang_role: user_lang_role, botconfig: botconfig })
        categoryargs(hodnoty)
    }
    else {
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