require("module-alias/register");
const { bot } = require('@src/bot');
const botconfig = require("@events/load_config_from_database");

bot.on("message", async message => {
    module.exports.msgzprava = message
    if (message.author.bot || message.channel.type === "dm") return;
    let user_lang_role = require("@handlers/check_user_for_role_language")({ message })
    let user_language = await require("@events/language_load").languages.get(user_lang_role).get("MESSAGE")
    if (botconfig == undefined) return require("@handlers/find_channel_by_name").run({ zprava: user_language.CFG_NOT_READY, roomname: message.channel.name, message: message });
    let prefix = botconfig.filter(config => config.name == "PREFIX")[0].value
    if (!message.content.startsWith(prefix)) return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase().slice(prefix.length);
    let args = messageArray.slice(1);
    let commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd));

    if (commandfile === undefined) return require("@handlers/find_channel_by_name").run({ zprava: user_language.CMD_NOT_EXIST, roomname: message.channel.name, message: message });
    let rle = commandfile.help.accessableby



    if (commandfile && rle.some(rl => message.member.roles.cache.has(message.guild.roles.cache.find(rla => rla.name === rl).id))) {
        commandfile.run(message, args, botconfig, user_lang_role);
        return
    }


    /*
    message.member.roles.cache.has(message.guild.roles.cache.find(rla => rla.name === rle[r]).id)
    
    for (var r = 0; r < rle.length; r++) {
        if (rle[r] === undefined) return;
        if (commandfile && message.member.roles.cache.has(message.guild.roles.cache.find(rla => rla.name === rle[r]).id)) {
            commandfile.run(message, args, botconfig, user_lang_role);
            return
        } else {

        }
    }*/
    require("@handlers/find_channel_by_name").run({ zprava: user_language.NOT_HAVE_PERMISSION, roomname: message.channel.name, message: message });
})


module.exports = {
    msgzprava: ""
}