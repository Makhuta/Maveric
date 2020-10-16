const { con } = require('../bot')
const botconfig = require("../botconfig.json")
const coinflip = require("../handlers/coinflip/coinflipcode")
const find_channel_by_name = require("../handlers/channelfinder/find_channel_by_name")

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
    return (xpecka)
}

module.exports.run = async (message, args) => {
    if (!isNumber(args[0]) || !isNumber(args[1])){

        let hodnotyout = ({ zprava: `Zkontroluj si příkaz.\n**Příklad příkazu:** ${botconfig.prefix}coinflip 100 60`, roomname: require("../botconfig/roomnames.json").botcommand })
        find_channel_by_name.run(hodnotyout)
        return
    }
    
    if (args[1] > 90) {

        let hodnotyout = ({ zprava: "Šance může být maximálně 90%.", roomname: require("../botconfig/roomnames.json").botcommand })
        find_channel_by_name.run(hodnotyout)
        return

    }

    if (args[1] < 10){

        let hodnotyout = ({ zprava: "Šance může být minimálně 10%.", roomname: require("../botconfig/roomnames.json").botcommand })
        find_channel_by_name.run(hodnotyout)
        return

    }
    if (args[0] < 10){

        let hodnotyout = ({ zprava: "Minimální množství XP je 10.", roomname: require("../botconfig/roomnames.json").botcommand })
        find_channel_by_name.run(hodnotyout)
        return

    }

    con.query(`SELECT * FROM userstats WHERE id = '${message.author.id}'`, (err, rows) => {
        if (err) throw err;

        let sql
        var xp
        var level
        var lastmsg
        var resallxp
        var tier
        var cas = Date.now()

        if (rows.length < 1) {
            sql = `INSERT INTO userstats (id, xp) VALUES ('${message.author.id}', 0)`
            con.query(sql)
        }
        else {
            xp = rows[0].xp
            level = rows[0].level
            lastmsg = rows[0].last_coinflip
            resallxp = allxp(level, xp)
        }
        var target = message.author
        var cas_ted = Date.now()
        var milisekundy = (parseInt(lastmsg) + 600000) - cas_ted
        var minuty = Math.round(milisekundy / 60000);
        if (resallxp < args[0]){

            let hodnotyout = ({ zprava: "Nemáš dostatek XP pro tuto hru.", roomname: require("../botconfig/roomnames.json").botcommand })
            find_channel_by_name.run(hodnotyout)
            return
    
        }

        if (5000 < args[0]){

            let hodnotyout = ({ zprava: "Maximální XP které lze vsadit je 5000.", roomname: require("../botconfig/roomnames.json").botcommand })
            find_channel_by_name.run(hodnotyout)
            return
    
        }

        if (Date.now() - lastmsg < 600000){

            let hodnotyout = ({ zprava: `Příkaz Coinflip můžete opět použít za ${minuty} minut.`, roomname: require("../botconfig/roomnames.json").botcommand })
            find_channel_by_name.run(hodnotyout)
            return
    
        }

        var sazka = ({ xp: args[0], pravdepodobnost: args[1] })
        coinflip.run(sazka, sql, con, xp, level, message, target, tier, xp)
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