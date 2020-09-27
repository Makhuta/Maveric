const { bot, con } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const { Guild } = require('discord.js');
const color = require("../colors/colors.json")
const rankup = require("../funkce/rankup")
const rankdown = require("../funkce/rankdown")
const coinflipcanvas = require("../funkce/coinflipcanvas")
const fs = require('fs')
const mysql = require('mysql')
const random = require('random')

function randomnumber() {
    return random.int(1, 100)
}

module.exports = {
    async run(sazka, sql, con, xp, level, message, target) {
        var sazkaxp = sazka.xp
        var sazkapravdepodobnost = sazka.pravdepodobnost
        var nasobitelxp = (100 - sazkapravdepodobnost) / 10
        var vyhernixp = Math.ceil(nasobitelxp * sazkaxp / 15)
        var prohraxp = sazkaxp
        var nahodnecislo = randomnumber()

        if (nahodnecislo <= sazkapravdepodobnost) {
            xp += vyhernixp
            await rankup.run(message, xp, level, sql, con, target)
            await coinflipcanvas.run(message, color.lime, color.green, "Win", nahodnecislo)
        }
        else if (nahodnecislo > sazkapravdepodobnost) {
            xp -= prohraxp
            await rankdown.run(message, xp, level, sql, con, target)
            await coinflipcanvas.run(message, color.red, color.maroon, "Lose", nahodnecislo)
        }
    }
}