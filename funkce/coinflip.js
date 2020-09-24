const { bot, con } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const { Guild } = require('discord.js');
const color = require("../colors.json")
const mysqlconfig = require("../mysqlconfig.json")
const rankup = require("../funkce/rankup")
const rankdown = require("../funkce/rankdown")
const fs = require('fs')
const mysql = require('mysql')
const random = require('random')

function randomnumber() {
    return random.int(1, 100)
}

module.exports = {
    async run(sazka, sql, con, xp, level, message) {
        var sazkaxp = sazka.xp
        var sazkapravdepodobnost = sazka.pravdepodobnost
        var nasobitelxp = (100 - sazkapravdepodobnost) / 10
        var vyhernixp = nasobitelxp * sazkaxp
        var prohraxp = sazkaxp
        var nahodnecislo = randomnumber()

        if (nahodnecislo <= sazkapravdepodobnost) {
            xp += vyhernixp
            await rankup.run(message, xp, level, sql, con)
            console.log("Win")
        }
        else if (nahodnecislo > sazkapravdepodobnost) {
            xp -= prohraxp
            await rankdown.run(message, xp, level, sql, con)
            console.log("Lose")
        }
        console.log(` Nahodne cislo: ${nahodnecislo}\n Vyherni XP: ${vyhernixp}\n XP: ${xp}\n Nasobitel XP: ${nasobitelxp}`)
    }
}