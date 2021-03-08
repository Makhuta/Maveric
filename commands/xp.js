require("module-alias/register");
require("dotenv").config();
const { pool } = require("@src/bot")
const canvasxp = require("@canvases/canvasxp")
const getrank = require("@handlers/getrank")

const name = "xp"
const accessableby = ["Member"]
const aliases = []
const response = "COMMAND_ROOM_NAME";

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("XP")
    let target = message.mentions.users.first() || message.guild.members.cache.get(args[1]) || message.author;

    pool.getConnection(async function(err, con) {
        if (err) throw err;
        con.query(`SELECT * FROM userstats WHERE id = '${target.id}'`, (err, rows) => {
            if (err) throw err;
            
            let hodnotyout = ({ zprava: user_language.NO_RECORD, roomname: botconfig.find(config => config.name == response).value, message: message })


            if (!rows[0]) return require("@handlers/find_channel_by_name").run(hodnotyout)
            let xp = rows[0].xp
            let level = rows[0].level
            let tier = rows[0].tier
            var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
            var callfunction = canvasxp.run
            getrank.run(xp, level, con, target, message, xpToNextLevel, callfunction, response, tier)
        })
    })
}


module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases
}