const fs = require("fs");
const path = require("path")
const { bot } = require("../../../bot")
const web = require("../../../website").web
const fetch = require("node-fetch")

module.exports = {
    run(hodnoty) {
        let res = hodnoty.res
        let view_hbs = hodnoty.view_hbs
        let title = hodnoty.title
        let host_value = hodnoty.host_value
        const main_list_folder = __dirname
        let member_count = bot.guilds.cache.first().members.cache.filter(user => !user.user.bot)
        let users_activity = []



        member_count.forEach(user => {
            users_activity.push(user.user.presence.status)
        })
        let online_count = "Online: " + users_activity.filter(u => u == "online").length
        let offline_count = "Offline: " + users_activity.filter(u => u == "offline").length
        let idle_count = "Idle: " + users_activity.filter(u => u == "idle").length
        let dnd_count = "DND: " + users_activity.filter(u => u == "dnd").length
        member_count = "Members: " + member_count.size

        let sites = []
        let channel_list = []
        let channels = bot.channels.cache.filter(ch => ch.type == "voice").filter(ch => ch.name.split(" ")[0] == "Free")
        channels.sort(function (a, b) {
            if (a.rawPosition < b.rawPosition) return -1;
            if (a.rawPosition > b.rawPosition) return 1;
            return 0;
        })

        let counter = ({ all: member_count, online: online_count, idle: idle_count, dnd: dnd_count, offline: offline_count })

        channels.forEach(channel => {
            let users_in_channel = []
            channel.members.forEach(user => {
                let activity_array = user.presence.activities.filter(activity => activity.type != "CUSTOM_STATUS")[0]
                let activity_name
                let activity_type
                if (activity_array != undefined) {
                    activity_name = activity_array.name
                    activity_type = activity_array.type.slice(0, 1) + activity_array.type.slice(1).toLowerCase()
                }
                else {
                    activity_name = ""
                    activity_type = ""
                }
                let user_activity = activity_type + ": " + activity_name
                users_in_channel.push({ user_username: user.user.username, user_activity: user_activity })
            })
            channel_list.push({ channel_name: channel.name, users: users_in_channel })
        })


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
            { site: "https://steamcommunity.com/groups/Vlcata", name: "Steam Group" },
            { site: "https://www.instagram.com/nsbr___/", name: "Instagram" },
            { site: "https://twitter.com/NSBR85992423", name: "Twitter" }
        )

        sites.sort(function (a, b) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        })

        res.render(view_hbs, { title: title, host_value: host_value, sites: sites, channel_list: channel_list, counter: counter, visitors: web.visitors.length - 1, start_time: web.start });
    }
}