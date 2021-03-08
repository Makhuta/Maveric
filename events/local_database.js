require("module-alias/register");
require("dotenv").config();
const { bot, pool } = require('@src/bot');


function get_data() {
    pool.getConnection(async function(err, con) {
        if (err) throw err;
        con.query(`SELECT * FROM userstats`, async(err, rows) => {
            if (err) throw err
            require("@handlers/userstats_to_map")(rows)

            //module.exports.database.rows = rows
        })

        con.query(`SELECT * FROM youtubers`, async(err, rows) => {
            if (err) throw err
            rows.forEach(row => {
                module.exports.youtubers.set(row.name, { name: row.name, channel_name: row.channel_name, channel_url: row.channel_url })
            });


            //module.exports.youtubers.rows = rows
        })
    })
}


bot.on("ready", () => {
    get_data()

    setInterval(() => {
        get_data()
    }, 600000)
})


module.exports = {
    database: new Map(),
    youtubers: new Map()
}