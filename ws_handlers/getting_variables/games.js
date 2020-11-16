module.exports = {
    run(hodnoty) {
        let res = hodnoty.res
        let view_hbs = hodnoty.view_hbs
        let title = hodnoty.title
        let host_value = hodnoty.host_value
        let games = ([
            { site: "no_game_yet", name: "NO GAME SET YET" }
        ])

        games.forEach(game_site => {
            game_site.site = host_value + game_site.site
        })

        games.sort(function (a, b) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        })

        res.render(view_hbs, { title: title, host_value: host_value, games: games });
    }
}