const { bot, con } = require('../bot');
const botconfig = require("../botconfig.json");
const color = require("../colorpaletes/colors.json")
const random = require('random')
const signpost = require("../handlers/ranks/signpost")

function generateXP() {
    return random.int(10, 30)
}


function databaze(message, con) {
    con.query(`SELECT * FROM userstats WHERE id = '${message.author.id}'`, (err, rows) => {
        if (err) throw err;
        //console.log(err + "\n")

        let sql
        //console.log(`\n${rows}\n`)
        if (rows.length < 1) {
            //console.log("prvni")
            sql = `INSERT INTO userstats (id, xp) VALUES ('${message.author.id}', ${generateXP()})`
            con.query(sql)
        }
        else {
            var xp = rows[0].xp
            var level = rows[0].level
            var lastmsg = rows[0].last_message
            var cas = Date.now()
            var target = message.author

            if (Date.now() - lastmsg > 60000) {
                xp += generateXP()
                let hodnoty = ({ type: "rankup", level: level, xp: xp, sql: sql, user: target, con: con, message: message })
                signpost.run(hodnoty)
                sql = `UPDATE userstats SET last_message = ${cas} WHERE id = '${message.author.id}'`;
                con.query(sql)
            }
            else return
        }
    })
}

bot.on("message", message => {
    if (message.author.bot || message.channel.type === "dm" || message.content.startsWith(botconfig.prefix)) return
    databaze(message, con);

})