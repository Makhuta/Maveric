const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', () =>{
    console.log('Ready!');
})

bot.on('message', msg=>{
    if(msg.content === 'ping') {
        msg.channel.send('Pong');       
    }
});

bot.login(process.env.BOT_TOKEN);
