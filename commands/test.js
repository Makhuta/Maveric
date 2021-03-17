require("module-alias/register");
require("dotenv").config();
const { bot, mail, mailOptions, user_cache } = require("@src/bot")
const test_load = require("@handlers/error_mail")
const { database } = require("@events/local_database")
const xp_stats = require("@configs/xp_stats.json")

const name = "test"
const accessableby = ["Bulgy", "Admins", "NSBR Bot Creators"]
const aliases = ["t"]
const response = "COMMAND_ROOM_NAME";


module.exports.run = async(message, args, botconfig) => {
    let target = message.author
    let user_stats = bot.userstats.get(target.id)
    let debug_msg = `${target.username}#${target.discriminator} have statistics => Level: ${user_stats.level} XP: ${user_stats.xp} XP to next Level: ${xp_stats[user_stats.level].xpToNextLevel}`

    //console.log(bot.userstats)

    require("@handlers/find_channel_by_name").run({ zprava: debug_msg, roomname: botconfig.find(config => config.name == "DEBUG_ROOM").value, message: message });
    //let out = require("@handlers/map_to_string")(database)
    //console.log(out)
    /*mail.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });*/
}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases
}