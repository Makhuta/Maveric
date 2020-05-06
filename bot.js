const { bot, Collection } = require("discord.js");
const fs = require("fs");

const bot = new bot({disableEveryone: true});
bot.commands = new Collection();


bot.on("ready", () => {
  console.log(`${bot.user.username} rocket arrived on Mars!`);
  bot.user.setActivity(`${cliet.guilds.size} Servers`);
})
          
fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("There isn't any command to load!");
    return;
  }
  console.log(`Loading ${jsfile.length} commands!`);

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} command has loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

          
bot.on("message", async message => {
   if (message.author.bot) return; 
   if (message.channel.type === "dm") return;

   let prefix = "bot prefix"
   let messageArray = message.content.split(" ");
   let cmd = messageArray[0].toLowerCase();
   let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot, message, args);
})

bot.login(process.env.BOT_TOKEN);