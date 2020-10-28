const { bot } = require('../bot');
const botconfig = require("../botconfig.json");
const roomids = require("../botconfig/roomids.json");


async function updateMembers (guild) {
    const onlinechannel = guild.channels.cache.get(roomids.onlinecountid)
    const offlinechannel = guild.channels.cache.get(roomids.offlinecountid)
    const onlinecount = guild.members.cache.filter(m => m.presence.status != 'offline' && !m.user.bot).size
    const offlinecount = guild.members.cache.filter(m => m.presence.status == 'offline'/* && !m.user.bot*/).size
    onlinechannel.setName('Online: ' + onlinecount)
    offlinechannel.setName('Offline: ' + offlinecount)
    console.log("Online: " + onlinecount + "\nOffline: " + offlinecount)
    let number = 1
    guild.members.cache.forEach(element => {
        console.log(number + ": " + element.user.username + ": " + element.presence.status + " - " + element.user.bot)
        number = number + 1
    });
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