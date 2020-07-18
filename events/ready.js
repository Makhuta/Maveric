const Discord = require("discord.js");
const { bot } = require('../bot');
const botconfig = require("../botconfig.json")
const color = require("../colors.json")

async function verifymessage() {

  await bot.channels.cache.find(c => c.name === botconfig.verifyroom).messages.fetch({ limit: 99 }).then(messages => {
    bot.channels.cache.find(c => c.name === botconfig.verifyroom).bulkDelete(messages)
  })

  bot.channels.fetch(bot.channels.cache.find(c => c.name === botconfig.verifyroom).id)
    .then(channel => {
      bot.channels.fetch(bot.channels.cache.find(c => c.name === botconfig.pravidlaroom).id)
        .then(channelname => {
          const msg = bot.channels.cache.get(channel.id)
          const lastmsg = msg.messages.channel.lastMessageID
          var embed = new Discord.MessageEmbed()
            .setTitle(` __Ověření__ `)
            .setDescription(`
            Pro přístup k serveru potvrďte že jste si přečetl/a ${channelname} reakcí.
            ↓ ↓ ↓ ↓
        `)
            .setColor(color.red)
          msg.send(embed)
          if (!msg.guild.emojis.cache.find(emoji => emoji.name === botconfig.verifyemojiname)) return
        });
    })
}

bot.login(process.env.BOT_TOKEN);
bot.on("ready", () => {
  console.log(`${bot.user.username} is Ready!`);
  bot.user.setActivity('NSBR Server', { type: "WATCHING" });

  verifymessage()

})

bot.on("message", async message => {
  const channel = botconfig.verifyroom
  if (message.channel.id !== bot.channels.cache.find(r => r.name === botconfig.verifyroom).id) return
  const emoji = message.guild.emojis.cache.find(emoji => emoji.name === botconfig.verifyemojiname).id
  message.react(emoji)
  //console.log(bot.channels.cache.find(c => c.name === channel).messages.channel.messages.cache.find(m => m.id === message.id).channel.messages.cache)
})