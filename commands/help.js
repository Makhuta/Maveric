const Discord = require("discord.js");
const { prefix } = require("../botconfig.json")
const color = require("../colors.json")
const fs = require("fs");
const { replaceResultTransformer } = require("common-tags");

module.exports.run = async (bot, message, args) => {
    //We have to set a argument for the help command beacuse its going to have a seperate argument.
    let helpArray = message.content.split(" ");
    let helpArgs = helpArray.slice(1);


    //Normal usage of (prefix)help without any args. (Shows all of the commands and you should set the commands yourself)
    if (!helpArgs[0]) {
        fs.readdir("./commands/", (err, files) => {

            var embed = new Discord.MessageEmbed()
            embed.setAuthor(`Seznam použitelných příkazů:`)
            global.seznamjs = files.join(', ')
            for (var i = 0; i <= files.length; i++) {
                seznamjs = seznamjs.replace('.js', '')
            }
            embed.setDescription(seznamjs)
            embed.addFields({ name: 'Prefix', value: prefix, inline: true },
            { name: 'Dotazy', value: 'Pro konkrétnější dotazy se obraťte na Admin team.\nPro seznam Admin teamu použijte příkaz ' + prefix + 'admins'})
            embed.setColor(color.aqua)

            message.channel.send(embed);

        })
    }

    //Reads the moudle.exports.help (This line of code is on commands folder, each command will read automaticly) by the second argument (the command name) and shows the information of it.
    if (helpArgs[0]) {
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

            message.channel.send(embed);
        }
    }
}

module.exports.help = {
    name: "help",
    description: "",
    usage: `${prefix}help pro seznam příkazů nebo ${prefix}help [příkaz] pro konkrétní příkaz`,
    accessableby: "Member",
    aliases: ["h"]
}