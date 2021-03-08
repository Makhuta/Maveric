require("module-alias/register");
require("dotenv").config();
const { pool } = require('@src/bot')
const coinflip = require("@handlers/coinflipcode")
const find_channel_by_name = require("@handlers/find_channel_by_name")

const name = "coinflip"
const accessableby = ["Member"]
const aliases = ["cf"]
const response = "GAME_ROOM_NAME";

const last_coinflip = new Map();

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }

function allxp(level, xp) {
    var xpecka = xp
    for (let l = 0; l < level; l++) {
        var xpToNextLevel = 5 * Math.pow(l, 2) + 50 * l + 100;
        xpecka = xpecka + xpToNextLevel;
    }
    return (xpecka)
}

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    var cas = Date.now()
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("COINFLIP")
    if (!isNumber(args[0]) || !isNumber(args[1])) {

        let hodnotyout = ({ zprava: user_language.ERROR_MSG.replace("&PREFIX", botconfig.find(config => config.name == "PREFIX").value), roomname: botconfig.find(config => config.name == response).value, message: message })
        find_channel_by_name.run(hodnotyout)
        return
    }

    if (args[1] > 90) {

        let hodnotyout = ({ zprava: user_language.MAX_CHANCE, roomname: botconfig.find(config => config.name == response).value, message: message })
        find_channel_by_name.run(hodnotyout)
        return

    }

    if (args[1] < 10) {

        let hodnotyout = ({ zprava: user_language.MIN_CHANCE, roomname: botconfig.find(config => config.name == response).value, message: message })
        find_channel_by_name.run(hodnotyout)
        return

    }
    if (args[0] < 10) {

        let hodnotyout = ({ zprava: user_language.MIN_BET, roomname: botconfig.find(config => config.name == response).value, message: message })
        find_channel_by_name.run(hodnotyout)
        return

    }
    var lastmsg = last_coinflip.get(message.author.id) || 0
    var milisekundy = (parseInt(lastmsg) + 600000) - cas
    var minuty = Math.round(milisekundy / 60000);

    if (lastmsg == 0) {
        last_coinflip.set(message.author.id, cas)
    }



    if (Date.now() - lastmsg < 600000) {

        let hodnotyout = ({ zprava: user_language.COOLDOWN.replace("&MINUTY", minuty), roomname: botconfig.find(config => config.name == response).value, message: message })
        find_channel_by_name.run(hodnotyout)
        return

    }
    pool.getConnection(async function(err, con) {
        if (err) throw err;
        con.query(`SELECT * FROM userstats WHERE id = '${message.author.id}'`, async (err, rows) => {
            if (err) throw err;

            let sql
            var xp
            var level
            var lastmsg
            var resallxp
            var tier


            if (rows.length < 1) {
                sql = `INSERT INTO userstats (id, xp) VALUES ('${message.author.id}', 0)`
                con.query(sql)
            } else {
                xp = rows[0].xp
                level = rows[0].level
                tier = rows[0].tier
                resallxp = allxp(level, xp)
            }
            var target = message.author

            if (resallxp < args[0]) {

                let hodnotyout = ({ zprava: user_language.NOT_ENOUGH_XP, roomname: botconfig.find(config => config.name == response).value, message: message })
                find_channel_by_name.run(hodnotyout)
                return

            }

            if (5000 < args[0]) {

                let hodnotyout = ({ zprava: user_language.MAX_BET, roomname: botconfig.find(config => config.name == response).value, message: message })
                find_channel_by_name.run(hodnotyout)
                return

            }



            var sazka = ({ xp: args[0], pravdepodobnost: args[1] })
            await coinflip.run(sazka, sql, con, xp, level, message, target, tier, xp, response)
                //sql = `UPDATE userstats SET last_coinflip = ${cas} WHERE id = '${message.author.id}'`;
                //con.query(sql)
            last_coinflip.set(message.author.id, cas)
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