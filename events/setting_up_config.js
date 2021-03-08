//Must be on the top of every code for accessing folders more easilly
require("module-alias/register");
require("dotenv").config();


const { bot, pool } = require('@src/bot');
const sleep = require("@handlers/sleep")
const config = require("@configs/default_config.json")

async function save_config(con, per_config) {
    let sql = `INSERT INTO config (config_name, config_value) VALUES ('${per_config.name}', '${per_config.value}')`
    con.query(sql)
    console.log(sql)
    sleep(500);
}

bot.on("ready", () => {
    pool.getConnection(async function(err, con) {
        if (err) throw err;
        con.query(`SELECT * FROM config`, (err, rows) => {
            if (err) throw err;
            let rows_array = []

            rows.forEach(row => {
                rows_array.push(row.config_name)
            })

            config.forEach(per_config => {
                if (rows_array.includes(per_config.name)) return
                save_config(con, per_config)
            });
        })

        sleep(1000);

        con.query(`SELECT * FROM config`, (err, rows) => {
            if (err) throw err;
            rows.forEach(row => {
                require("@events/load_config_from_database").push({ name: row.config_name, value: row.config_value })
            })
        })
    })
})