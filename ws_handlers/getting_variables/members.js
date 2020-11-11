const { use } = require("random")
const { bot, con } = require("../../bot")



function toarray(list, users) {
    users.push(list)
}


module.exports = {
    async run(hodnoty) {
        let res = hodnoty.res
        let view_hbs = hodnoty.view_hbs
        let title = hodnoty.title
        let host_value = hodnoty.host_value
        let app = hodnoty.app
        var xp = 0
        var level = 0
        var xpToNextLevel = 0
        var users = new Array()



        bot.users.cache.filter(u => !u.bot).forEach(async (user) => {
            let output

            users.push({ id: user.id, username: user.username, discriminator: user.discriminator, xp: 0, level: 0, xpToNextLevel: 0 })
            await con.query(`SELECT * FROM userstats WHERE id = '${user.id}'`, async (err, rows) => {
                if (err)
                    throw err

                if (!rows[0])
                    return
                xp = rows[0].xp
                level = rows[0].level
                xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
                output = "TEST"//{ id: user.id, username: user.username, discriminator: user.discriminator, xp: xp, level: level, xpToNextLevel: xpToNextLevel }

                /* users.push({
                     id: user.id,
                     username: user.username,
                     discriminator: user.discriminator,
                     xp: xp,
                     level: level,
                     xpToNextLevel: xpToNextLevel
                 })*/
                //await users.push(output)
                let get_user = users.find(u => u.id == user.id)
                get_user.xp = xp
                get_user.level = level
                get_user.xpToNextLevel = xpToNextLevel
                return users
            })
            console.log(users)
        });

        console.log(users)
        res.render(view_hbs, { title: title, host_value: host_value, user: users });
        console.log(users)


    }
}