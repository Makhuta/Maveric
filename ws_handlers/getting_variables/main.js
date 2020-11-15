module.exports = {
    run(hodnoty) {
        let res = hodnoty.res
        let view_hbs = hodnoty.view_hbs
        let title = hodnoty.title
        let host_value = hodnoty.host_value
        let sites = ([
            { site: "members", name: "Members" },
            { site: "games", name: "Games" }
        ])

        sites.forEach(this_site => {
            this_site.site = host_value + this_site.site
        })

        //Custom Websites
        sites.push(
            { site: "https://www.facebook.com/groups/vlciherniskupina/", name: "Facebook" },
            { site: "https://discord.gg/N7fxaAC", name: "Discord" },
            { site: "https://steamcommunity.com/groups/Vlcata", name: "Steam Group" }
        )

        sites.sort(function (a, b) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        })

        res.render(view_hbs, { title: title, host_value: host_value, sites: sites });
    }
}