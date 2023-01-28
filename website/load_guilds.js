const { client } = require(DClientLoc);
const {join} = require("path");
const util = require('util')


function timeConverterJSON(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var year = a.getFullYear().toString();
    var month = a.getMonth().toString().padStart(2, "0");
    var date = a.getDate().toString().padStart(2, "0");
    var hour = a.getHours().toString().padStart(2, "0");
    var min = a.getMinutes().toString().padStart(2, "0");
    var sec = a.getSeconds().toString().padStart(2, "0");
    var time = { year, month, date, hour, min, sec };
    return time;
}

async function parsed_config(guild_id) {
    let config = GuildsConfigs[guild_id].config;
    return [
        {
            name: "Gate category",
            value: config.GATECATEGORY
        },
        {
            name: "Gate channel",
            value: config.GATEROOM
        },
        {
            name: "Server stats category",
            value: config.SERVERSTATS
        },
        {
            name: "Member count channel",
            value: config.MEMBERCOUNT
        },
        {
            name: "Online count channel",
            value: config.ONLINECOUNT
        },
        {
            name: "Offline count channel",
            value: config.OFFLINECOUNT
        },
        {
            name: "Bot advertisement",
            value: config.BOTADVERTISMENT ? "True" : "False"
        },
        {
            name: "Counter enabled",
            value: config.COUNTERENABLED ? "True" : "False"
        },
        {
            name: "Online counter enabled",
            value: config.ONLINE_COUNTER_ENABLED ? "True" : "False"
        },
        {
            name: "Offline counter enabled",
            value: config.OFFLINE_COUNTER_ENABLED ? "True" : "False"
        },
        {
            name: "Member counter enabled",
            value: config.MEMBERS_COUNTER_ENABLED ? "True" : "False"
        },
        {
            name: "Stats category enabled",
            value: config.STATS_CATEGORY_ENABLED ? "True" : "False"
        },
        {
            name: "Money enabled",
            value: config.MONEYENABLED ? "True" : "False"
        },
        {
            name: "Welcome message enabled",
            value: config.WELCOME_MESSAGE_ENABLED ? "True" : "False"
        },
        {
            name: "Welcomer enabled",
            value: config.WELCOMERENABLED ? "True" : "False"
        },
    ];
}


module.exports = {
    async run() {
        let output = [];
        let guids = client.guilds.cache;
        for(guild of guids) {
            guild = guild[1];
            let members_array = [];
            let bots_array = [];
            let members_count = 0;
            let bots_count = 0;
            let has_members = false;
            let has_bots = false;
            let members = guild.members.cache;
            for(member of members) {
                member = member[1];
                let joined_date = timeConverterJSON(member.joinedTimestamp);
                if(member.user.bot) {
                    has_bots = true;
                    bots_count++;
                    bots_array.push({
                        id: member.user.id,
                        name: member.user.username,
                        joinedTimestamp: member.joinedTimestamp,
                        joined_date: `${joined_date.date}.${joined_date.month}.${joined_date.year} ${joined_date.hour}:${joined_date.min}`
                    })
                } else {
                    has_members = true;
                    members_count++;
                    members_array.push({
                        id: member.user.id,
                        name: member.user.username,
                        nickname: member.nickname ? member.nickname : "NULL",
                        discriminator: member.user.discriminator,
                        joinedTimestamp: member.joinedTimestamp,
                        joined_date: `${joined_date.date}.${joined_date.month}.${joined_date.year} ${joined_date.hour}:${joined_date.min}`
                    })
                }
                //console.info(util.inspect(member, false, null, true));
            }

            output.push({
                id : guild.id,
                name: guild.name,
                bot_count: bots_count,
                member_count: members_count,
                has_bots,
                has_members,
                bots: bots_array,
                members: members_array,
                config: await parsed_config(guild.id)
            });
        }
        

        return output;
    }
}