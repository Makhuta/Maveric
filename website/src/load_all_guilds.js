const { client } = require(DClientLoc);

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
            
            let owner = {};
            let members_count = 0;
            let bots_count = 0;
            for(member of guild.members.cache) {
                member = member[1];
                if(member.user.bot) {
                    bots_count++;
                } else {
                    members_count++;
                }
                if(guild.ownerId == member.user.id) {
                    let joined_date = timeConverterJSON(member.joinedTimestamp);
                    let created_date = timeConverterJSON(member.user.createdTimestamp);
                    owner["id"] = member.user.id;
                    owner["username"] = member.user.username;
                    owner["discriminator"] = member.user.discriminator;
                    owner["nickname"] = member.nickname ? member.nickname : "NULL";
                    owner["avatar_url"] = member.displayAvatarURL();
                    owner["joinedTimestamp"] = member.joinedTimestamp;
                    owner["joined_date"] = `${joined_date.date}.${joined_date.month}.${joined_date.year} ${joined_date.hour}:${joined_date.min}`;
                    owner["createdTimestamp"] = member.user.createdTimestamp;
                    owner["created_date"] = `${created_date.date}.${created_date.month}.${created_date.year} ${created_date.hour}:${created_date.min}`;
                }
            }

            let roles_count = 0;
            for(role of guild.roles.cache) {
                roles_count++;
            }


            let creation_date = timeConverterJSON(guild.createdTimestamp);

            output.push({
                id: guild.id,
                name: guild.name,
                owner: owner,
                created_timestamp: guild.createdTimestamp,
                created_date: `${creation_date.date}.${creation_date.month}.${creation_date.year} ${creation_date.hour}:${creation_date.min}`,
                members: members_count,
                bots: bots_count,
                roles: roles_count,
                icon_url: guild.iconURL() ? guild.iconURL() : "https://cdn.discordapp.com/embed/avatars/3.png",
                config: await parsed_config(guild.id),
            })
        }
        return output;
    }
}