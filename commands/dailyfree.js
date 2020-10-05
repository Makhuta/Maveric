const { con } = require('../bot');
const botconfig = require("../botconfig.json")
const signpost = require("../handlers/ranks/signpost")
const time_words = require("../botconfig/time_words.json")

const name = "dailyfree"
const description = `Přidá denní odměnu XP.`
const usage = `${botconfig.prefix}dailyfree`
const accessableby = ["Member"]
const aliases = ["df"]

module.exports.run = async (message) => {
    con.query(`SELECT * FROM userstats WHERE id = '${message.author.id}'`, (err, rows) => {
        let sql
        let target = message.author
        var cas = Date.now()
        var xp = rows[0].xp
        var level = rows[0].level
        var last_claim = rows[0].last_daily_xp
        var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
        var reward = Math.round(xpToNextLevel / 100)
        var cas_ted = Date.now()
        var milisekundy = (parseInt(last_claim) + 86400000) - cas_ted
        var minuty = Math.round(milisekundy/60000);
        var hodiny = Math.floor(minuty / 60)
        minuty -= (hodiny * 60)
        //console.log(`${hodiny}:${minuty}`)
        if (Date.now() - last_claim < 86400000) return (message.channel.send(`Dnešní free XP sis již vybral.\nDalší odměnu si můžeš vybrat za ${hodiny} ${time_words.hodiny[hodiny]} a ${minuty} ${time_words.minuty[minuty]}.`))
        xp += reward
        let hodnoty = ({ type: "rankup", sql: sql, con: con, user: target, level: level, xpToNextLevel: xpToNextLevel, xp: xp, message: message })
        signpost.run(hodnoty)
        sql = `UPDATE userstats SET last_daily_xp = ${cas} WHERE id = '${message.author.id}'`;
        con.query(sql)
        message.channel.send(`Právě sis vybral svou denní odměnu o hodnotě ${reward} XP`)
    })
}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}