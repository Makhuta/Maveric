const find_channel_by_name = require("../channelfinder/find_channel_by_name")
const check_user_for_role_language = require("../check_user_role/check_user_for_role_language")

module.exports = {
    run: (hodnoty) => {
        let helpArgs = hodnoty.helpargs
        let bot = hodnoty.bot
        let Discord = hodnoty.discord
        let color = hodnoty.color
        let message = hodnoty.message
        let command = helpArgs[0];

        let hodnoty_lang = ({ message: message })
        let user_lang_role = check_user_for_role_language.run(hodnoty_lang)
        let user_language = require("../../events/language_load").languages.find(l => l.NAME == user_lang_role).ARRAY.HELP.withargs
        let user_language_descriptions = require("../../events/language_load").languages.find(l => l.NAME == user_lang_role).ARRAY.HELP.descriptions

        if (bot.commands.has(command)) {

            command = bot.commands.get(command);
            var embed = new Discord.MessageEmbed()
                .setAuthor(user_language.AUTHOR.replace("$COMMAND_NAME", command.help.name))
            embed.addFields({ name: user_language.FIELDS[0].NAME, value: user_language.FIELDS[0].VALUE.replace("$COMMAND_DESCRIPTION", user_language_descriptions.find(cmd_des => cmd_des.NAME == command.help.name).VALUE) }, { name: user_language.FIELDS[1].NAME, value: user_language.FIELDS[1].VALUE.replace("$COMMAND_USAGE", command.help.usage) }, { name: user_language.FIELDS[2].NAME, value: user_language.FIELDS[2].VALUE.replace("$COMMAND_PERMISSIONS", command.help.accessableby.join(", ")) }, { name: user_language.FIELDS[3].NAME, value: user_language.FIELDS[3].VALUE.replace("$COMMAND_ALIAS", command.help.aliases) })
                .setColor(color.lime)

            let hodnotyout = ({ zprava: embed, roomname: require("../../botconfig/roomnames.json").botcommand })
            find_channel_by_name.run(hodnotyout)
        }
    }
}