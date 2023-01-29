const { client } = require(DClientLoc);

module.exports = {
    run() {
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
                    owner["id"] = member.user.id;
                    owner["username"] = member.user.username;
                    owner["discriminator"] = member.user.discriminator;
                    owner["nickname"] = member.nickname ? member.nickname : "NULL";
                    owner["avatar_url"] = member.displayAvatarURL();
                }
            }



            output.push({
                id: guild.id,
                name: guild.name,
                owner: owner,
                members: members_count,
                bots: bots_count,
                icon_url: guild.iconURL() ? guild.iconURL() : "https://cdn.discordapp.com/embed/avatars/3.png",
            })
        }
        return output;
    }
}