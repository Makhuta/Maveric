const find_channel_by_name = require("../channelfinder/find_channel_by_name")
const { bot } = require("../../bot")
const check_user_for_role_language = require("../check_user_role/check_user_for_role_language")

module.exports = {
    run: (hodnoty) => {
        let Discord = hodnoty.discord
        let fs = hodnoty.fs
        let color = hodnoty.color
        let message = hodnoty.message
        let command
        let list_of_commands = []
        let hodnoty_lang = ({ message: message })
        let user_lang_role = check_user_for_role_language.run(hodnoty_lang)
        let user_language = require("../../events/language_load").languages.find(l => l.NAME == user_lang_role).ARRAY.HELP.noargs
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
            embed.addFields({ name: user_language.FIELDS[0].NAME, value: user_language.FIELDS[0].VALUE.replace("$PREFIX", hodnoty.prefix), inline: true }, { name: user_language.FIELDS[1].NAME, value: user_language.FIELDS[1].VALUE.replace("$PREFIX", hodnoty.prefix) }, { name: user_language.FIELDS[2].NAME, value: user_language.FIELDS[2].VALUE.replace("$PREFIX", hodnoty.prefix) })
            embed.setColor(color.aqua)

            let hodnotyout = ({ zprava: embed, roomname: require("../../botconfig/roomnames.json").botcommand })
            find_channel_by_name.run(hodnotyout)
        })
    }
}