const botconfig = require("./botconfig.json");
const Discord = require('discord.js');
const bot = new Discord.Client();



bot.on('ready', () =>{
    console.log('Ready!');
    bot.user.setActivity("Just normal day at Work.")
})

bot.on('message', message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    
})

bot.login(process.env.BOT_TOKEN);