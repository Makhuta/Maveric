const botconfig = require("./botconfig.json");
const Discord = require('discord.js');
const bot = new Discord.Client();

const PREFIX = botconfig.prefix;

bot.on("ready", async () => {
    console.log('Ready!');
    bot.user.setActivity("Just normal day at Work.")
});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let messageArray = msg.content.substring(PREFIX.length).split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    switch (cmd) {
        case 'botinfo':
            message.channel.send({embed: {
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


});

bot.login(process.env.BOT_TOKEN);