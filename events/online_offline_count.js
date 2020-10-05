const { bot } = require('../bot');
const botconfig = require("../botconfig.json");
const roomids = require("../botconfig/roomids.json");


const updateMembers = guild => {
    const onlinechannel = guild.channels.cache.get(roomids.onlinecountid)
    const offlinechannel = guild.channels.cache.get(roomids.offlinecountid)
    const botroleid = guild.roles.cache.find(r => r.name === botconfig.botrolename).id
    const numofallbots = guild.roles.cache.get(botroleid).members.size.toLocaleString()
    const offlinecount = (guild.members.cache.filter(m => m.presence.status === 'offline').size.toString())
    const online = guild.members.cache.filter(m => m.presence.status !== 'offline').size
    const onlinecount = (online - numofallbots)
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