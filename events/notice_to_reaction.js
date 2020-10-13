const { bot, con } = require('../bot');
const time_delays = require("../botconfig/time_delays.json")
const botconfig = require("../botconfig.json")

const time = parseInt(time_delays.notice_to_reaction_time)

const notice_message = () => {
    const guild = bot.guilds.cache.get(botconfig.guildid);
    guild.roles.cache.forEach(role => {
        if (role.name === "Member") {
            let list = bot.guilds.cache.get(botconfig.guildid)
            list.members.cache.forEach(member => {
                let member_roles = member.roles
                if (!member_roles.cache.has(role.id) && !member.user.bot) {
                    member.send("Vidím že ses připojil na náš server NSBR a stále sis nepřečetl nebo nepotvrdil že sis přečetl pravidla.\n" +
                        "Můžeš tak učinit ve 🔐verify-room🔐.\n" +
                        "Těšíme se na tebe.")
                }

            });
        }
    });
}


bot.on('ready', () => {
    setInterval(() => {
        let sql
        let timenow = Date.now()
        let cas
        let type = "notice_reaction"

        con.query(`SELECT * FROM times WHERE time_type = '${type}'`, (err, rows) => {
            if (err) throw err;

            if (rows.length < 1) {
                sql = `INSERT INTO times (time_type, time) VALUES ('${type}', ${timenow})`
                con.query(sql)
            }

            else {
                cas = rows[0].time

                if (timenow > cas) {
                    let delay = timenow + time
                    notice_message()
                    sql = `UPDATE times SET time = ${delay} WHERE time_type = '${type}'`;
                    con.query(sql)
                }
            }
        })
    }, 10000)
});