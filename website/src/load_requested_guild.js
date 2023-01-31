const { client } = require(DClientLoc);
const { join } = require("path");
const PermissionToArray = require(join(Functions, "global/PermissionToArray.js"));

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

function user_add(user_array, user_obj, roles) {
    let joined_date = timeConverterJSON(user_obj.joinedTimestamp);
    let created_date = timeConverterJSON(user_obj.user.createdTimestamp);
    let user_roles = [];
    let id = 0;
    for(role of roles.filter(role => user_obj.roles.cache.some(user_role => user_role.id == role.id))) {
        user_roles.push({});
        for(role_key of Object.keys(role)) {
            user_roles[id][role_key] = role[role_key];
        }
        user_roles[id]["role_owner"] = `${user_obj.user.id}_${user_obj.user.bot ? "bot" : "user"}`;
        id++;
    }
    user_array.push({
        id: user_obj.user.id,
        username: user_obj.user.username,
        discriminator: user_obj.user.discriminator,
        nickname: user_obj.nickname ? user_obj.nickname : "NULL",
        avatar_url: user_obj.displayAvatarURL(),
        joinedTimestamp: member.joinedTimestamp,
        joined_date: `${joined_date.date}.${joined_date.month}.${joined_date.year} ${joined_date.hour}:${joined_date.min}`,
        createdTimestamp: member.user.createdTimestamp,
        created_date: `${created_date.date}.${created_date.month}.${created_date.year} ${created_date.hour}:${created_date.min}`,
        roles: user_roles,
    });
}

module.exports = {
    async run(guild_id) {
        let requested_guild = client.guilds.cache.get(guild_id);
        let roles = [];
        for(role of requested_guild.roles.cache) {
            role = role[1];
            roles.push({
                id: role.id,
                name: role.name,      
                raw_position: role.rawPosition,
                tags: role.tags,
                managed: role.managed,
                mentionable: role.mentionable,
                permissions: PermissionToArray(role.permissions)
            });
        }

        let members = [];
        let bots = [];
        let owner = {};
        for(member of requested_guild.members.cache) {
            member = member[1];
            if(member.user.bot) {
                user_add(bots, member, roles);
            } else {
                user_add(members, member, roles);
            }
            if(requested_guild.ownerId == member.user.id) {
                let joined_date = timeConverterJSON(member.joinedTimestamp);
                let created_date = timeConverterJSON(member.user.createdTimestamp);
                let owner_roles = [];
                let id = 0;
                for(role of roles.filter(role => member.roles.cache.some(user_role => user_role.id == role.id))) {
                    owner_roles.push({});
                    for(role_key of Object.keys(role)) {
                        owner_roles[id][role_key] = role[role_key];
                    }
                    owner_roles[id]["role_owner"] = `${member.user.id}_owner`;
                    id++;
                }
                owner["id"] = member.user.id;
                owner["username"] = member.user.username;
                owner["discriminator"] = member.user.discriminator;
                owner["nickname"] = member.nickname ? member.nickname : "NULL";
                owner["avatar_url"] = member.displayAvatarURL();
                owner["joinedTimestamp"] = member.joinedTimestamp;
                owner["joined_date"] = `${joined_date.date}.${joined_date.month}.${joined_date.year} ${joined_date.hour}:${joined_date.min}`;
                owner["createdTimestamp"] = member.user.createdTimestamp;
                owner["created_date"] = `${created_date.date}.${created_date.month}.${created_date.year} ${created_date.hour}:${created_date.min}`;
                owner["roles"] = owner_roles;
            }
        }

        let creation_date = timeConverterJSON(requested_guild.createdTimestamp);

        let output = {
            id: requested_guild.id,
            name: requested_guild.name,
            owner,
            created_timestamp: guild.createdTimestamp,
            created_date: `${creation_date.date}.${creation_date.month}.${creation_date.year} ${creation_date.hour}:${creation_date.min}`,
            roles,
            members,
            bots,
            icon_url: requested_guild.iconURL() ? requested_guild.iconURL() : "https://cdn.discordapp.com/embed/avatars/3.png",
            config: await parsed_config(requested_guild.id),
        }
        return output;
    }
}