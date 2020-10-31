const { bot } = require('../bot');
const lower_or_higher_reaction_canvas = require("../handlers/lower_or_higher/lower_or_higher_reaction_canvas").loh
const lower_or_higher = require("../commands/lowerorhigher")
const roomnames = require("../botconfig/roomnames.json");
const emojinames = require("../botconfig/emojinames.json");

function error_message(typ, user) {
    let zprava = [
        "Tato hra není pro tebe."
    ]
    user.send(zprava[typ])
}

bot.on("messageReactionAdd", (reaction, user) => {
    if (!user) return;
    if (user.bot) return;
    if (!reaction.message.channel.guild) return;
    //console.log(bot.channels.cache.find(r => r.name === botconfig.verifyroom).id)
    if (reaction.emoji.name == emojinames.verifyemojiname && reaction.message.channel.id === bot.channels.cache.find(r => r.name === roomnames.verifyroom).id) {
        let role = reaction.message.guild.roles.cache.find(r => r.name == "Member");
        reaction.message.guild.member(user).roles.add(role).catch(console.error);
    }


    if (reaction.emoji.name == emojinames.up || reaction.emoji.name == emojinames.down) {
        //console.log(reaction.users.cache.filter(bot_message => bot_message !== lower_or_higher_reaction_canvas.zprava_pro_reakce.author))
        //console.log(lower_or_higher_reaction_canvas.author)

        let user_find = (reaction.users.cache.filter(bot_message => bot_message !== lower_or_higher_reaction_canvas.zprava_pro_reakce.author)).keyArray()
        let user = reaction.users.cache.get(user_find[0])

        if (user !== lower_or_higher_reaction_canvas.target) {
            let typ = 0
            error_message(typ, user)
            reaction.users.remove(user.id)
            return
        }

        lower_or_higher_reaction_canvas.reakce = reaction.emoji.name
        lower_or_higher_reaction_canvas.zprava_pro_reakce.delete()
        lower_or_higher_reaction_canvas.stav_her = 0
        lower_or_higher.result()
    }

});