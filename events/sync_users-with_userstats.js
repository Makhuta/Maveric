require("module-alias/register");
require("dotenv").config();
const { bot, pool } = require("@src/bot")



bot.on("ready", () => {
    var user_array = bot.users.cache.filter(u => !u.bot)
    let sql

    pool.getConnection(async function(err, con) {
        if (err) throw err;
        con.query(`SELECT * FROM userstats`, async(err, rows) => {
            if (err) throw err

            let users_ids = []
            let rows_ids = []

            let users_exist = []
            let rows_exist = []

            let out_index

            user_array.forEach(user => {
                users_ids.push(user.id)
            })

            rows.forEach(user_row => {
                rows_ids.push(user_row.id)
            })


            users_ids.forEach(id => {
                if (rows_ids.includes(id)) {
                    rows_exist.push({ id: id, exist: true })
                } else {
                    rows_exist.push({ id: id, exist: false })
                }
            })

            rows_ids.forEach(id => {
                if (users_ids.includes(id)) {
                    users_exist.push({ id: id, exist: true })
                } else {
                    users_exist.push({ id: id, exist: false })
                }
            })

            rows_exist.forEach(exist => {
                if (!exist.exist) {
                    sql = `INSERT INTO userstats (id, xp) VALUES ('${exist.id}', 0)`
                    con.query(sql)
                    console.log(`ADDED ${exist.id}!`)
                }
            })

            /*users_exist.forEach(exist => {
                if (!exist.exist) {
                    sql = `DELETE FROM userstats WHERE id='${exist.id}'`
                    con.query(sql)
                    console.log(`REMOVED ${exist.id}!`)
                }
            })*/
        })
    })
})