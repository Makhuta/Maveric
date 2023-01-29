const { client } = require(DClientLoc);

function user_add(user_array, user_obj) {
    user_array.push({
        id: user_obj.user.id,
        username: user_obj.user.username,
        discriminator: user_obj.user.discriminator,
        nickname: user_obj.nickname ? user_obj.nickname : "NULL",
        avatar_url: user_obj.displayAvatarURL(),
    });
}

module.exports = {
    run(guild_id) {
        let requested_guild = client.guilds.cache.get(guild_id);
        let members = [];
        let bots = [];
        let owner = {};
        for(member of requested_guild.members.cache) {
            member = member[1];
            if(member.user.bot) {
                user_add(bots, member);
            } else {
                user_add(members, member);
            }
            if(requested_guild.ownerId == member.user.id) {
                owner["id"] = member.user.id;
                owner["username"] = member.user.username;
                owner["discriminator"] = member.user.discriminator;
                owner["nickname"] = member.nickname ? member.nickname : "NULL";
                owner["avatar_url"] = member.displayAvatarURL();
            }
        }



        let output = {
            id: requested_guild.id,
            name: requested_guild.name,
            owner,
            members,
            bots,
            icon_url: requested_guild.iconURL() ? requested_guild.iconURL() : "https://cdn.discordapp.com/embed/avatars/3.png",
        }
        return output;
    }
}