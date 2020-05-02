const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'NzAxNDIwNTcxNjk4NzkwNDcw.Xp3DTA.lTxfgBdhJj0u44kJK4JW5ER1uww';

const PREFIX = '!';

bot.on('ready', () =>{
    console.log('Ready!');
})

bot.on('message', msg=>{

    let args = msg.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case 'test':
            msg.channel.send('Tohle je test');
            break;
        case 'creator':
            msg.channel.send('https://www.youtube.com/Makhuta')
            break;
        
    }
})

bot.login(token);
