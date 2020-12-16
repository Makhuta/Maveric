const { bot, con } = require("../../../bot")
const local_database = require("../../../events/local_database").database
const xp_colors = require("../../../colorpaletes/xpcolor.json")

function allxp(level, xp) {
    var xpecka = xp
    for (let l = 0; l < level; l++) {
        var xpToNextLevel = 5 * Math.pow(l, 2) + 50 * l + 100;
        xpecka = xpecka + xpToNextLevel;
    }
    return (xpecka)
}

module.exports = {
    async run(hodnoty) {
        let res = hodnoty.res
        let view_hbs = hodnoty.view_hbs
        let title = hodnoty.title
        let host_value = hodnoty.host_value
        var xp = 0
        var level = 0
        var xpToNextLevel = 0
        var users = new Array()
        var rows = local_database.rows

        bot.users.cache.filter(u => !u.bot).forEach(async(user) => {
            users.push({ id: user.id, username: user.username, discriminator: user.discriminator, xp: 0, level: 0, xpToNextLevel: 0, allxp: 0, xp_color: "", avatar: user.displayAvatarURL({ format: "jpg", size: 512 }) })
        })


        rows.forEach(async(user) => {
            xp = user.xp
            level = user.level
            xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
            let get_user = users.find(u => u.id == user.id)
            if (!get_user) {

            } else {
                get_user.xp = xp
                get_user.level = level
                get_user.xpToNextLevel = xpToNextLevel
                get_user.xp_color = xp_colors[Math.ceil((100 / (xpToNextLevel)) * xp)]
                if (xp != 0 || level != 0) {
                    get_user.allxp = allxp(level, xp)
                }
            }
        })


        users.sort(function(a, b) {
            if (a.username.toLowerCase() < b.username.toLowerCase()) return -1;
            if (a.username.toLowerCase() > b.username.toLowerCase()) return 1;
            return 0;
        })
        res.render(view_hbs, { title: title, host_value: host_value, user: users, public_list: hodnoty.public_list });






    }
}