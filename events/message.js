const { bot } = require('../bot');
const botconfig = require("../botconfig.json")
const prefix = botconfig.prefix;
const prikaz = require("../handlers/prikaz/prikaztrigger")

/*function prikaz(message) {
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0].toLowerCase();
  let args = messageArray.slice(1);

  if (!message.content.startsWith(prefix)) return;
  let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)));
  if (commandfile === undefined) {
    message.channel.send("Příkaz neexistuje")
    return
  }
  let rle = commandfile.help.accessableby

  for (var r = 0; r < rle.length; r++) {
    if (rle[r] === undefined) return;
    if (commandfile && message.member.roles.cache.has(message.guild.roles.cache.find(rla => rla.name === rle[r]).id)) {
      commandfile.run(message, args);
      return
    }
  }
}*/

bot.on("message", message => {
  if (message.author.bot || message.channel.type === "dm") return;
  let hodnoty = ({ prefix: prefix, message: message, bot: bot })
  prikaz.run(hodnoty);

})