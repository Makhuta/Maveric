require("module-alias/register");
require("dotenv").config();
const { bot, pool } = require('@src/bot');
const botconfig = require("@events/load_config_from_database");
const random = require('random')
const signpost = require("@handlers/ranks/signpost")
const last_message = new Map()

function generateXP() {
    return random.int(10, 30)
}


function databaze(message) {
    var target = message.author
    var cas = Date.now()
    var lastmsg = last_message.get(target.id) || 0

    if (!last_message.has(target.id)) {
        last_message.set(target.id, cas)

    }
    if (Date.now() - lastmsg > 60000) {
        pool.getConnection(async function(err, con) {
            if (err) throw err;
            con.query(`SELECT * FROM userstats WHERE id = '${message.author.id}'`, (err, rows) => {
                if (err) throw err;
                //console.log(err + "\n")

                let sql
                    //console.log(`\n${rows}\n`)
                if (rows.length < 1) {
                    //console.log("prvni")
                    sql = `INSERT INTO userstats (id, xp) VALUES ('${message.author.id}', ${generateXP()})`
                    con.query(sql)
                } else {
                    var xp = rows[0].xp
                    var level = rows[0].level
                    var tier = rows[0].tier

                    xp += (Math.ceil(generateXP() * (1 + tier / 10)))
                    let hodnoty = ({ type: "rankup", level: level, xp: xp, sql: sql, user: target, con: con, message: message })
                    signpost.run(hodnoty)
                    last_message.set(target.id, cas)
                    con.query(`SELECT * FROM userstats`, (err2, rows2) => {
                        if (err2) throw err2;
                        require("@handlers/userstats_to_map")(rows2)
                    })
                }
            })
        })
    }
}

bot.on("message", message => {
    let prefix = botconfig.filter(config => config.name == "PREFIX")[0]
    if (prefix == undefined) return
    if (message.author.bot || message.channel.type === "dm" || message.content.startsWith(prefix.value) || message.channel.name == "joins") return
    databaze(message);

})