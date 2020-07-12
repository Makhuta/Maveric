const {bot} = require('../bot');
const botconfig = require("../botconfig.json")

bot.on("message", async message => {
    //console.log(bot.users.cache.get)
    if (message.author.bot || message.channel.type === "dm") return;
    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
  
    if (!message.content.startsWith(prefix)) return;
    let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)));
    let rleall = commandfile.help.accessableby
    let rle = rleall.split(", ")
  
    for (var r = 0; r < rle.length; r++) {
      //console.log(rle[r])
      if (rle[r] === undefined) return;
      if (commandfile && message.member.roles.cache.has(message.guild.roles.cache.find(rla => rla.name === rle[r]).id)) {
        //r === rle.length;
        commandfile.run(bot, message, args);
        return
      }
    }
    
    
  })