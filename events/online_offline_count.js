const { bot } = require('../bot');
const botconfig = require("../botconfig.json");
const roomids = require("../botconfig/roomids.json");


async function updateMembers (guild) {
    const onlinechannel = guild.channels.cache.get(roomids.onlinecountid)
    const offlinechannel = guild.channels.cache.get(roomids.offlinecountid)

    const onlinebots = guild.members.cache.filter(m => m.presence.status != 'offline' && m.user.bot).size
    const offlinebots = guild.members.cache.filter(m => m.presence.status == 'offline' && m.user.bot).size
    const allbots = onlinebots + offlinebots
    const online = guild.members.cache.filter(m => m.presence.status != 'offline').size
    const offline = guild.members.cache.filter(m => m.presence.status == 'offline').size
    const member_count = guild.memberCount - allbots

    const offlinecount = member_count - online
    const onlinecount = member_count - offline

    onlinechannel.setName('Online: ' + onlinecount)
    offlinechannel.setName('Offline: ' + offlinecount)
}

bot.on('ready', () => {
    const guild = bot.guilds.cache.get(botconfig.guildid)
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