const find_channel_by_name = require("../channelfinder/find_channel_by_name")

module.exports = {
    run: (hodnoty) => {
        let helpArgs = hodnoty.helpargs
        let bot = hodnoty.bot
        let Discord = hodnoty.discord
        let color = hodnoty.color
        let message = hodnoty.message
        let command = helpArgs[0];

        if (bot.commands.has(command)) {

            command = bot.commands.get(command);
            var embed = new Discord.MessageEmbed()
                .setAuthor(`Příkaz ${command.help.name}`)
                .setDescription(
                    `- **Popis příkazu** __${command.help.description || "Pro příkaz není žádný popis."}__\n` +
                    `- **Použití příkazu:** __${command.help.usage || "Žádné použití"}__\n` +
                    `- **Permise pro příkaz:** __${command.help.accessableby || "Member"}__\n` +
                    `- **Alias příkazu:** __${command.help.aliases || "Žádné aliasy"}__`
                )
                .setColor(color.lime)

            let hodnotyout = ({ zprava: embed, roomname: require("../../botconfig/roomnames.json").botcommand })
            find_channel_by_name.run(hodnotyout)
        }
    }
}