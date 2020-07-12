const {bot} = require('../bot');
const botconfig = require("../botconfig.json")

bot.login(BOT_TOKEN);
bot.on("ready", () => {
    console.log(`${bot.user.username} is Ready!`);
    bot.user.setActivity('Just another day in work.');
  })