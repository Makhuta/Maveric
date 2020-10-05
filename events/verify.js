const { bot } = require('../bot');
const roomnames = require("../botconfig/roomnames.json");
const emojinames = require("../botconfig/emojinames.json");

bot.on("messageReactionAdd", (reaction, user) => {
    if (!user) return;
    if (user.bot) return;
    if (!reaction.message.channel.guild) return;
    //console.log(bot.channels.cache.find(r => r.name === botconfig.verifyroom).id)
    if (reaction.emoji.name == emojinames.verifyemojiname && reaction.message.channel.id === bot.channels.cache.find(r => r.name === roomnames.verifyroom).id) {
        let role = reaction.message.guild.roles.cache.find(r => r.name == "Member");
        reaction.message.guild.member(user).roles.add(role).catch(console.error);
            }

});