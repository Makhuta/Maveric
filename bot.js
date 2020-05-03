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
            msg.channel.send({embed: {
                color: 3447003,
                author: {
                  name: client.user.username,
                  icon_url: client.user.avatarURL
                },
                title: "This is an embed",
                url: "http://google.com",
                description: "This is a test embed to showcase what they look like and what they can do.",
                fields: [{
                    name: "Fields",
                    value: "They can have different fields with small headlines."
                  },
                  {
                    name: "Masked links",
                    value: "You can put [masked links](http://google.com) inside of rich embeds."
                  },
                  {
                    name: "Markdown",
                    value: "You can put all the *usual* **__Markdown__** inside of them."
                  }
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: "© Example"
                }
              }
            });
            break;
    }
})

bot.login(process.env.BOT_TOKEN);