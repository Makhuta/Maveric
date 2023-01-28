const { client } = require(DClientLoc);
const {join} = require("path");
const util = require('util')
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
    return output;
}

async function make_user(user_list, user_obj, roles_list) {
    let joined_date = timeConverterJSON(user_obj.joinedTimestamp);
    let user_roles = {};
    for(role of user_obj.roles.cache) {
        user_roles[role[0]] = roles_list[role[0]];
    }
    user_list[user_obj.user.id] = {
        id: user_obj.user.id,
        username: user_obj.user.username,
        discriminator: user_obj.user.discriminator,
        nickname: user_obj.nickname ? user_obj.nickname : "NULL",
        roles: Object.values(user_roles),
        joinedTimestamp: user_obj.joinedTimestamp,
        joined_date: `${joined_date.date}.${joined_date.month}.${joined_date.year} ${joined_date.hour}:${joined_date.min}`,
        avatar_url: user_obj.displayAvatarURL()
    }
}

function ChannelList(guild) {
    let TextChannels = [];
    let VoiceChannels = [];
    let CategoryChannels = [];
    let Structured = {};
    let All = {};

    for (ch of guild.channels.cache) {
        ch = ch[1];
        //Voice channel
        if (ch.type == 2) {
        All[ch.id] = {
            id: ch.id,
            name: ch.name,
            type: "Voice channel",
            parent_id: ch.parentId,
            raw_position: ch.rawPosition,
            bitrate: ch.bitrate,
            user_limit: ch.userLimit
        };
        VoiceChannels.push(All[ch.id]);
        } 
        //Text channel
        else if (ch.type == 0) {
        All[ch.id] = {
            id: ch.id,
            name: ch.name,
            type: "Text channel",
            parent_id: ch.parentId,
            raw_position: ch.rawPosition
        };
        TextChannels.push(All[ch.id]);
        } 
        //Channel category
        else if (ch.type == 4) {
        All[ch.id] = {
            id: ch.id,
            name: ch.name,
            type: "Channel category",
            raw_position: ch.rawPosition
        };
        CategoryChannels.push(All[ch.id]);
        }
    }

    for(c of CategoryChannels) {
        Structured[c.id] = {
            id: c.id,
            name: c.name,
            type: c.type,
            raw_position: c.rawPosition,
            channels: [...VoiceChannels.filter(channel => channel.parent_id == c.id), ...TextChannels.filter(channel => channel.parent_id == c.id)]
        };
    }

    return {TextChannels, VoiceChannels, CategoryChannels, Structured, All};
}

async function parse_invites(guild, channel_list, members_list) {
    let invite_list = {};
    let invites = new Map();
    try {
        invites = await guild.invites.fetch();
    } catch (e) {
        console.info(e);
    }
    for(invite of invites.values()) {
        let invite_created_at = timeConverterJSON(invite.createdTimestamp);
        invite_list[invite.code] = {
            code: invite.code,
            max_age: invite.maxAge,
            uses: invite.uses,
            max_uses: invite.maxUses,
            inviter: [members_list[invite.inviterId]],
            channels: [channel_list.All[invite.channel.id]],
            created_timestamp: invite.createdTimestamp,
            created_at: `${invite_created_at.date}.${invite_created_at.month}.${invite_created_at.year} ${invite_created_at.hour}:${invite_created_at.min}`,
        }
    }
    return invite_list;
}


module.exports = {
    async run() {
        let output = [];
        let guids = client.guilds.cache;
        for(guild of guids) {
            guild = guild[1];
            let roles_list = {};
            let roles = guild.roles.cache;
            for(role of roles) {
                role = role[1];
                roles_list[role.id] = {
                    id: role.id,
                    name: role.name,
                    rawpos: role.rawPosition,
                    managed: role.managed,
                    mentionable: role.mentionable,
                    permissions: PermissionToArray(role.permissions)
                }
            }





            let members_list = {};
            let bot_list = {};
            let members = guild.members.cache;
            for(member of members) {
                member = member[1];
                if(member.user.bot) {
                    make_user(bot_list, member, roles_list);
                } else {
                    make_user(members_list, member, roles_list);
                }
            }

            let guild_created_at = timeConverterJSON(guild.createdAt)
            let channels_list = ChannelList(guild);

            output.push({
                id : guild.id,
                name: guild.name,
                members: Object.values(members_list),
                bots: Object.values(bot_list),
                roles: Object.values(roles_list),
                channels: Object.values(channels_list.Structured),
                invites: Object.values(await parse_invites(guild, channels_list, members_list)),
                created_at: `${guild_created_at.date}.${guild_created_at.month}.${guild_created_at.year} ${guild_created_at.hour}:${guild_created_at.min}`,
                owner: [members_list[guild.ownerId]],
                config: Object.values(await parsed_config(guild.id))
            });
        }
        
        return output;
    }
}