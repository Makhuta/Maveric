const { bot, con } = require('../bot');


function get_data() {
    con.query(`SELECT * FROM userstats`, async (err, rows) => {
        if (err) throw err


        module.exports.database.rows = rows
    })
}


bot.on("ready", () => {
    get_data()

    setInterval(() => {
        get_data()
    }, 600000)
})


module.exports.database = {
    rows: ""
}