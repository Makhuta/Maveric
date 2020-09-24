const { bot, con } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json")
const color = require("../colors/colors.json")
const coinflip = require("../funkce/coinflip")

const name = "coinflip"
const description = "Tento příkaz je jen pro budoucí testování bota."
const usage = `${botconfig.prefix}coinflip [výše sázky] [šance na výhru v %]`
const accessableby = ["Member"]
const aliases = ["cf"]

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }

function allxp(level, xp) {
    var xpecka = xp
    for (let l = 0; l < level; l++) {
        var xpToNextLevel = 5 * Math.pow(l, 2) + 50 * l + 100;
        xpecka = xpecka + xpToNextLevel;
    }
    /*sql = `UPDATE userstats SET allxp = ${xpecka} WHERE id = '${target.id}'`;
    con.query(sql)*/
    return (xpecka)
}

module.exports.run = async (bot, message, args) => {
    if (!isNumber(args[0]) || !isNumber(args[1])) return (message.channel.send("Zkontroluj si příkaz.\n**Příklad příkazu:** /coinflip 100 60"))
    if (args[1] > 90) return (message.channel.send("Šance může být maximálně 90%."))
    if (args[1] < 10) return (message.channel.send("Šance může být minimálně 10%."))
    if (args[0] < 10) return (message.channel.send("Minimální množství XP je 10."))

    con.query(`SELECT * FROM userstats WHERE id = '${message.author.id}'`, (err, rows) => {
        if (err) throw err;
        //console.log(err + "\n")

        let sql
        var xp
        var level
        var lastmsg
        var resallxp
        var cas = Date.now()

        if (rows.length < 1) {
            //console.log("prvni")
            sql = `INSERT INTO userstats (id, xp) VALUES ('${message.author.id}', 0)`
            con.query(sql)
        }
        else {
            xp = rows[0].xp
            level = rows[0].level
            lastmsg = rows[0].last_coinflip
            resallxp = allxp(level, xp)
        }
        var cas_ted = Date.now()
        var milisekundy = (parseInt(lastmsg) + 600000) - cas_ted
        var minuty = Math.round(milisekundy/60000);
        console.log(minuty + "\n" + milisekundy + "\n" + lastmsg + "\n" + cas_ted)
        if (resallxp < args[0]) return (message.channel.send("Nemáš dostatek XP pro tuto hru."))
        if (Date.now() - lastmsg < 600000) return (message.channel.send(`Příkaz Coinflip můžete opět použít za ${minuty} minut.`))
        var sazka = ({ xp: args[0], pravdepodobnost: args[1] })
        coinflip.run(sazka, sql, con, xp, level, message)
        sql = `UPDATE userstats SET last_coinflip = ${cas} WHERE id = '${message.author.id}'`;
        con.query(sql)
    })
}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}