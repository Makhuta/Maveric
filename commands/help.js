module.exports.run = async(bot, message, args) => {
    fs.readdir("./comamnds/", (err, files) => {
        if(err) console.error(err);

        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        if(jsfiles.length <= 0) {
            console.log("No commands to load!");
            return;
        }


        let result = jsfiles.forEach((f, i) => {
            let props = require(`./${f}`);
            let filesArray = [props.help.name, props.help.description, props.help.usage]
            message.author.send(`**${filesArray[0]}** \n${filesArray[1]} \n${filesArray[2]}`);
        });

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