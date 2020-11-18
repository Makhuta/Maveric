const fs = require("fs");
const path = require("path")

module.exports = {
    run(hodnoty) {
        let res = hodnoty.res
        let view_hbs = hodnoty.view_hbs
        let title = hodnoty.title
        let host_value = hodnoty.host_value
        const main_list_folder = __dirname
        let sites = []

        let main_list = fs.readdirSync(path.join(main_list_folder, "..", "main_list"))
        main_list.forEach(f => {
            main_list[main_list.indexOf(f)] = f.split(".")[0]
        })

        main_list.forEach(f => {
            let name = f[0].toUpperCase() + f.slice(1)
            name = name.split("_").join(" ")
            sites.push({ site: f, name: name })
        })

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