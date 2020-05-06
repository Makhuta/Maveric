const fs = require("fs");
const Discord = require("discord.js");

module.exports.run = async(bot, message, args) => {
    fs.readdir("./cmds/", (err, files) => {
        if(err) console.error(err);

        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        if(jsfiles.length <= 0) {
            console.log("No commands to load!");
            return;
        }

        var namelist = "";
        var desclist = "";
        var usage = "";

        let result = jsfiles.forEach((f, i) => {
            let props = require(`./${f}`);
            namelist = props.help.name;
            desclist = props.help.description;
            usage = props.help.usage;
        });

        message.author.send(`**${namelist}** \n${desclist} \n${usage}`);
    });
}

module.exports.help = {
    name: "help",
    aliases: ["h"],
    category: "info",
    description: "Returns all commands, or one specific command info",
    usage: "[command | alias]",
    /*run: async (bot, message, args) => {
        getAll(client, message);*/
    }
/*}
function getAll(bot, message) {
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")

    const commands = (category) => {
        return bot.commands
        .filter(cmd => cmd.category === category)
        .map(cmd => `- \`${cmd.name}\``)
        .join("\n");
    }
    const info = client.categories
    .map(cat => stripIndents`**${cat[0].coUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
    .reduce((string, category) => string + "\n" + category);
    return message.channel.send(embed.setDescription(info));
}*/