const botconfig = require("./botconfig.json");
const Discord = require('discord.js');
const fs = require("fs");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if(err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0) {
        console.log("No commands!");
        return;
    }
    console.log(`Loading ${jsfiles.length} commands!`);

    jsfiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        bot.commands.set(props.help.name, props);
    });
});

const PREFIX = botconfig.prefix;
const prefix = botconfig.prefix;

bot.on('ready', () =>{
    console.log('Ready!');
})

bot.on('message', msg=>{
	if (msg.author == bot.user) { // Prevent bot from responding to its own messages
        return
    }

    let messageArray = msg.content.substring(PREFIX.length).split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    let cmd = bot.commands.get(command.slice(prefix.length))
    if(cmd) cmd.run(bot, msg, args);

    /*switch(command){
        case 'test':
            msg.channel.send('Tohle je test');
            break;
        case 'creator':
            msg.channel.send('https://www.youtube.com/Makhuta')
            break;
        case 'botinfo':
            let botembed = new Discord.MessageEmbed()
            .setTitle("Bot Information")
            .setColor("#15f153")
            .addField("Bot Name", bot.user.username);
            msg.channel.send(botembed);
            break;
    }*/
})

bot.login(process.env.BOT_TOKEN);