const { bot, con } = require('../bot');
const time_delays = require("../botconfig/time_delays.json")
const botconfig = require("../botconfig.json")

const time = parseInt(time_delays.notice_to_reaction_time);
const zprava =
    "Vidím že ses připojil na náš server NSBR a stále sis nepřečetl nebo nepotvrdil že sis přečetl pravidla.\n" +
    "Můžeš tak učinit ve 🔐verify-room🔐.\n" +
    "Těšíme se na tebe.";

const notice_message = () => {
    let guild = bot.guilds.cache.get(botconfig.guildid)
    let member_role = guild.roles.cache.filter(role => role.name == "Member")
    let member_role_id
    member_role.forEach(role => {
        member_role_id = role.id
    })
    let members = guild.members.cache
    let users_array = []

    members.forEach(member => {
        if (member.roles.cache.has(member_role_id)) return
        if (member.user.bot) return
        users_array.push(member.user)
    })

    users_array.forEach(user => {
        user.send(zprava)
    })
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