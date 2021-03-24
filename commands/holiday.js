require("module-alias/register");
require("dotenv").config();
const moment = require("moment")
const svatky = require("@configs/svatky.json")
const signpost = require("@handlers/ranks/signpost")
const { database } = require("@events/local_database")
const { bot } = require("@src/bot")
const database_access = require("@handlers/database_access")

const name = "holiday"
const accessableby = ["Member"]
const aliases = ["hl"]
const category = "Events"

function zprava(typ, svatek_nazev, zpusob, target, reward, user_language) {
    let vystup_zprava = [
        [user_language.NOT_HOLIDAY],
        [user_language.EASTER, user_language.DNES_JE.replace("&SVATEK_NAZEV", svatek_nazev).replace("&REVARD", reward), user_language.DNES_JSOU.replace("&SVATEK_NAZEV", svatek_nazev).replace("&REVARD", reward)]
    ]
    target.send(vystup_zprava[typ][zpusob])
}

function getEaster(year) {
    var f = Math.floor,
        // Golden Number - 1
        G = year % 19,
        C = f(year / 100),
        // related to Epact
        H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
        // number of days from 21 March to the Paschal full moon
        I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
        // weekday for the Paschal full moon
        J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
        // number of days from 21 March to the Sunday on or before the Paschal full moon
        L = I - J,
        month = 3 + f((L + 40) / 44),
        day = L + 28 - 31 * f(month / 4);

    return [month, day];
}

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("HOLIDAY")
    let message_author = message.author
    let datum = new Date
    let datum_moment = moment()
    let moment_hodiny = datum_moment.format("H")
    let moment_minuty = datum_moment.format("m")
    let za_x_hodin = 24 - moment_hodiny
    let za_x_minut = 60 - moment_minuty
    let za_cas = (((za_x_hodin * 60) + za_x_minut) * 60) * 100
    let mesic = datum.getMonth() + 1
    let den = datum.getDate()
    let svatek_mesice
    let svatek_dny
    let hodnota_svatku
    let is_holliday = false
    let velikonoce_mesic = getEaster(datum.getFullYear())[0]
    let velikonoce_den = getEaster(datum.getFullYear())[1]
    var reward


    svatky.forEach(async element => {
        svatek_mesice = element.mesice
        hodnota_svatku = parseInt(element.hodnota)


        if (svatek_mesice.includes(mesic) || velikonoce_mesic == mesic) {
            let index_mesice = svatek_mesice.indexOf(mesic)
            svatek_dny = element.dny[index_mesice]
            if (svatek_dny.includes(den) || velikonoce_den == den) {
                is_holliday = true
                let svatek_nazev = element.nazev.toString()

                let typ = 1
                let zpusob = element.zpusob
                if (velikonoce_den == den && velikonoce_mesic == mesic) {
                    zpusob = 0
                }

                //con.query(`SELECT * FROM userstats WHERE id = '${message_author.id}'`, (err, rows) => {
                let user_data = await database_access.get(message, message_author)
                let sql
                let target = message_author
                var cas = Date.now() + za_cas
                var xp = user_data.xp
                var level = user_data.level
                var tier = user_data.tier
                var last_claim = user_data.last_hl
                var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
                reward = hodnota_svatku

                //console.log(`${hodiny}:${minuty}`)
                if (Date.now() < last_claim) return (target.send(user_language.ALREADY_WITHDRAWED.replace("&ZA_XP_HODIN", za_x_hodin).replace("&ZA_XP_MINUT", za_x_minut)))
                xp += (reward * (1 + (tier / 10)))
                user_data.xp = xp;
                user_data.last_hl = cas;
                await database_access.set(message, message_author, user_data)
                    //let hodnoty = ({ type: "rankup", sql: sql, con: con, user: target, level: level, xpToNextLevel: xpToNextLevel, xp: xp, message: message })
                    //signpost.run(hodnoty)
                await signpost.run(target.id, message, target)
                    //sql = `UPDATE userstats SET last_hl = ${cas} WHERE id = '${message_author.id}'`;
                    //con.query(sql)

                zprava(typ, svatek_nazev, zpusob, message_author, reward, user_language)
                return
                //})
            }
            return
        }
    });

    if (!is_holliday) {
        let typ = 0
        let zpusob = 0
        zprava(typ, "", zpusob, message_author, "", user_language)
        return
    }
}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases,
    category: category
}