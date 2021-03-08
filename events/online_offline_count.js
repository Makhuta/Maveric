//Must be on the top of every code for accessing folders more easilly
require("module-alias/register");
require("dotenv").config();



const { bot } = require('@src/bot');


async function updateMembers (guild) {
    const onlinechannel = guild.channels.cache.filter(chan => chan.name.split(" ")[0] == "Online:").first()
    const offlinechannel = guild.channels.cache.filter(chan => chan.name.split(" ")[0] == "Offline:").first()

    const online = guild.members.cache.filter(m => m.presence.status != 'offline' && !m.user.bot).size
    const offline = guild.members.cache.filter(m => m.presence.status == 'offline' && !m.user.bot).size
    /*const allbots = onlinebots + offlinebots
    const online = guild.members.cache.filter(m => m.presence.status != 'offline').size
    const offline = guild.members.cache.filter(m => m.presence.status == 'offline').size
    const member_count = guild.memberCount - allbots

    const offlinecount = member_count - online
    const onlinecount = member_count - offline*/

    onlinechannel.setName('Online: ' + online)
    offlinechannel.setName('Offline: ' + offline)
}

bot.on('ready', () => {
    const guild = bot.guilds.cache.first();
    updateMembers(guild)

    setInterval(() => {
        updateMembers(guild)
    }, 600000)
});

bot.on("guildMemberAdd", member => {
    updateMembers(member.guild)
});

bot.on("guildMemberRemove", member => {
    updateMembers(member.guild)
});