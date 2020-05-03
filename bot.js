const botconfig = require("./botconfig.json");
const Discord = require('discord.js');
const bot = new Discord.Client();


const PREFIX = botconfig.prefix;

bot.on('ready', () =>{
    console.log('Ready!');
})

bot.on('message', msg=>{
	if (msg.author == bot.user) { // Prevent bot from responding to its own messages
        return
    }

    let args = msg.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case 'test':
            msg.channel.send('Tohle je test');
            break;
        case 'creator':
            msg.channel.send('https://www.youtube.com/Makhuta')
            break;
        case 'botinfo':
            let botembed = new Discord.RichEmbed()
            .setDescription("Bot Information")
            .setColor("#15f153")
            .addField("Bot Name", bot.user.username);
            msg.channel.send(botembed);
            break;
    }
})

bot.login(process.env.BOT_TOKEN);