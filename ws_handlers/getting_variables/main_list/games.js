const fs = require("fs");
const path = require("path")

module.exports = {
    run(hodnoty) {
        let res = hodnoty.res
        let view_hbs = hodnoty.view_hbs
        let title = hodnoty.title
        let host_value = hodnoty.host_value
        let games_list_folder = __dirname
        let games = []

        let games_list = fs.readdirSync(path.join(games_list_folder, "..", "games"))
        games_list.forEach(f => {
            games_list[games_list.indexOf(f)] = f.split(".")[0]
        })

        games_list.forEach(f => {
            let name = f[0].toUpperCase() + f.slice(1)
            games.push({ site: f, name: name })
        })

        games.forEach(game_site => {
            game_site.site = host_value + game_site.site
        })

        games.sort(function(a, b) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        })

        res.render(view_hbs, { title: title, host_value: host_value, games: games, public_list: hodnoty.public_list });
    }
}