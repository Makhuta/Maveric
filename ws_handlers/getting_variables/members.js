const { use } = require("random")
const { bot, con } = require("../../bot")


module.exports = {
    run(hodnoty) {
        let res = hodnoty.res
        let view_hbs = hodnoty.view_hbs
        let title = hodnoty.title
        let host_value = hodnoty.host_value
        let app = hodnoty.app
        var users = []
        var xp
        var level
        var xpToNextLevel

        bot.users.cache.filter(u => !u.bot).forEach(async user => {
            con.query(`SELECT * FROM userstats WHERE id = '${user.id}'`, (err, rows) => {
                if (err) throw err;

                if (!rows[0]) return
                xp = rows[0].xp
                level = rows[0].level
                xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100

                users.push({
                    id: user.id,
                    username: user.username,
                    discriminator: user.discriminator,
                    xp: xp || "0",
                    level: level || "0",
                    xpToNextLevel: xpToNextLevel || "0"
                })
            })
        });

        res.render(view_hbs, { title: title, host_value: host_value, user: users });


    }
}