require("module-alias/register");
require("dotenv").config();
const { pool } = require('@src/bot');
const signpost = require("@handlers/ranks/signpost")

const name = "dailyfree"
const accessableby = ["Member"]
const aliases = ["df"]

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("DAILYFREE")
    pool.getConnection(async function(err, con) {
        if (err) throw err;
        con.query(`SELECT * FROM userstats WHERE id = '${message.author.id}'`, (err, rows) => {
            let sql
            let target = message.author
            var cas = Date.now()
            var xp = rows[0].xp
            var tier = rows[0].tier
            var level = rows[0].level
            var last_claim = rows[0].last_daily_xp
            var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
            var reward = Math.round((xpToNextLevel / 100) * (1 + tier / 10))
            var cas_ted = Date.now()
            var milisekundy = (parseInt(last_claim) + 86400000) - cas_ted
            var minuty = Math.round(milisekundy / 60000);
            var hodiny = Math.floor(minuty / 60)
            minuty -= (hodiny * 60)
                //console.log(`${hodiny}:${minuty}`)
            if (Date.now() - last_claim < 86400000) return (target.send(user_language.ALREADY_WITHDRAWED.replace("&HODINY", hodiny).replace("&MINUTY", minuty)))
            xp += reward
            let hodnoty = ({ type: "rankup", sql: sql, con: con, user: target, level: level, xpToNextLevel: xpToNextLevel, xp: xp, message: message })
            signpost.run(hodnoty)
            sql = `UPDATE userstats SET last_daily_xp = ${cas} WHERE id = '${message.author.id}'`;
            con.query(sql)
            target.send(user_language.WITHDRAW.replace("&REWARD", reward))
            con.query(`SELECT * FROM userstats`, (err2, rows2) => {
                if (err2) throw err2;
                require("@handlers/userstats_to_map")(rows2)
            })
        })
    })
}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases
}