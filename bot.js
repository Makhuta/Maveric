const botconfig = require("./botconfig.json");
const Discord = require('discord.js');
const bot = new Discord.Client();



bot.on("ready", async () =>{
    console.log('Ready!');
    bot.user.setActivity("Just normal day at Work.")
});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(cmd === `${prefix}botinfo`){

        let botembed = new Discord.RichEmbed()
        .setDescription("Bot Information")
        .setColor("#15f153")
        .addField("Bot Name", bot.user.username);

        return message.channel.send({botembed});
    }
    
});

bot.login(process.env.BOT_TOKEN);