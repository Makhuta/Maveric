require("module-alias/register");
require("dotenv").config();
const color = require("@colorpaletes/colors.json")
    //const rankup = require("../funkce/rankup")
    //const rankdown = require("../funkce/rankdown")
const signpost = require("@handlers/ranks/signpost")
const random = require('random')
const coinflipcanvas = require("@canvases/coinflipcanvas")
const { database } = require("@events/local_database")
const { bot } = require("@src/bot")

function randomnumber() {
    return random.int(1, 100)
}

module.exports = {
    async run(sazka, sql, con, xp, level, message, target, tier, userxp, response) {
        var sazkaxp = sazka.xp
        var sazkapravdepodobnost = sazka.pravdepodobnost
        var nasobitelxp = (100 - sazkapravdepodobnost) / 10
        var vyhernixp = Math.ceil(nasobitelxp * sazkaxp / 15)
        var prohraxp = sazkaxp
        var nahodnecislo = randomnumber()
        var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
        let user_data = bot.userstats.get(target.id);

        if (nahodnecislo <= sazkapravdepodobnost) {
            user_data.xp += (vyhernixp * (1 + tier / 10))
            require("@src/bot").bot.userstats.set(target.id, user_data);
            //let hodnoty = ({ type: "rankup", sql: sql, con: con, user: target, level: level, xpToNextLevel: xpToNextLevel, xp: xp, message: message })
                //await rankup.run(message, xp, level, sql, con, target, tier, userxp)
            await coinflipcanvas.run(message, color.lime, color.green, "Win", nahodnecislo, response)
            signpost.run(target.id, message, target)
        } else if (nahodnecislo > sazkapravdepodobnost) {
            user_data.xp -= prohraxp
            require("@src/bot").bot.userstats.set(target.id, user_data);
            //let hodnoty = ({ type: "rankdown", sql: sql, con: con, user: target, level: level, xpToNextLevel: xpToNextLevel, xp: xp, message: message })
                //await rankdown.run(message, xp, level, sql, con, target, tier, userxp)
            await coinflipcanvas.run(message, color.red, color.maroon, "Lose", nahodnecislo, response)
            signpost.run(target.id, message, target)
        }
    }
}