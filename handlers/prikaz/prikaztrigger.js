module.exports = {
    run: (hodnoty) => {
        let message = hodnoty.message
        let bot = hodnoty.bot
        let messageArray = message.content.split(" ");
        let cmd = messageArray[0].toLowerCase();
        let args = messageArray.slice(1);
      
        if (!message.content.startsWith(hodnoty.prefix)) return;
        let commandfile = bot.commands.get(cmd.slice(hodnoty.prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(hodnoty.prefix.length)));
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
          else return message.channel.send("Nemáš dostatečné práva na použití tohohle příkazu.")
        }
    }
}