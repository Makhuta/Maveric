const color = require("../../colorpaletes/colors.json")
//const rankup = require("../funkce/rankup")
//const rankdown = require("../funkce/rankdown")
const signpost = require("../ranks/signpost")
const random = require('random')
const coinflipcanvas = require("./coinflipcanvas")

function randomnumber() {
    return random.int(1, 100)
}

module.exports = {
    async run(sazka, sql, con, xp, level, message, target, tier, userxp) {
        var sazkaxp = sazka.xp
        var sazkapravdepodobnost = sazka.pravdepodobnost
        var nasobitelxp = (100 - sazkapravdepodobnost) / 10
        var vyhernixp = Math.ceil(nasobitelxp * sazkaxp / 15)
        var prohraxp = sazkaxp
        var nahodnecislo = randomnumber()
        var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100

        if (nahodnecislo <= sazkapravdepodobnost) {
            xp += vyhernixp
            let hodnoty = ({ type: "rankup", sql: sql, con: con, user: target, level: level, xpToNextLevel: xpToNextLevel, xp: xp, message: message })
            //await rankup.run(message, xp, level, sql, con, target, tier, userxp)
            await coinflipcanvas.run(message, color.lime, color.green, "Win", nahodnecislo)
            signpost.run(hodnoty)
        }
        else if (nahodnecislo > sazkapravdepodobnost) {
            xp -= prohraxp
            let hodnoty = ({ type: "rankdown", sql: sql, con: con, user: target, level: level, xpToNextLevel: xpToNextLevel, xp: xp, message: message })
            //await rankdown.run(message, xp, level, sql, con, target, tier, userxp)
            await coinflipcanvas.run(message, color.red, color.maroon, "Lose", nahodnecislo)
            signpost.run(hodnoty)
        }
    }
}