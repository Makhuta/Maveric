const Discord = require("discord.js")
const { bot, con } = require('../bot');
const botconfig = require("../botconfig.json")
const mysql = require('mysql')
const random = require('random')
const color = require("../colors.json")
const prefix = botconfig.prefix;

function prikaz(message) {
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
  //console.log(message.member.roles.cache)

  for (var r = 0; r < rle.length; r++) {
    //console.log(rle[r])
    if (rle[r] === undefined) return;
    if (commandfile && message.member.roles.cache.has(message.guild.roles.cache.find(rla => rla.name === rle[r]).id)) {
      //r === rle.length;
      commandfile.run(bot, message, args, con);
      return
    }
  }
}

bot.on("message", message => {
  if (message.author.bot || message.channel.type === "dm") return;
  prikaz(message);

})