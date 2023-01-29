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
    let output = {};

    for(key of Object.keys(config)) {
        value = config[key] == "" ? "undefined" : config[key] == true ? "True" : config[key] == false ? "False" : config[key];
        output[key] = {
            name: key,
            value: value
        };
    }
    return Object.values(output);
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
                console.info(util.inspect(member.displayAvatarURL(), false, null, true));
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