const { bot, con } = require('../bot');

const day_miliseconds = 86400000;


function get_data() {
    let member_count = bot.guilds.cache.first().members.cache.filter(user => !user.user.bot).size
    con.query(`SELECT * FROM member_graph`, async (err, rows) => {
        if (err) throw err

        let dates = []
        rows.forEach(row => {
            dates.push({date: row.date, num_of_members: row.num_of_members})
        });
        let date_last = dates[dates.length - 1].date

        if (dates == undefined) {
            sql = `INSERT INTO member_graph (date, num_of_members) VALUES ('${Date.now()}', '${member_count}')`
            con.query(sql)
        }

        else if (date_last + day_miliseconds <= Date.now()){
            sql = `INSERT INTO member_graph (date, num_of_members) VALUES ('${date_last + day_miliseconds}', '${member_count}')`
            con.query(sql)
        }
        module.exports.database.dates = dates
    })
}


bot.on("ready", () => {
    get_data()

    setInterval(() => {
        get_data()
    }, 60000)
})


module.exports.database = {
    dates: ""
}