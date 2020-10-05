const { bot } = require('../bot');
const botconfig = require("../botconfig.json");
const roomids = require("../botconfig/roomids.json")


const updateMembers = guild => {
    const channel = guild.channels.cache.get(roomids.membercountid)
    const numofallmemb = guild.memberCount.toLocaleString()
    const botroleid = guild.roles.cache.find(r => r.name === botconfig.botrolename).id
    const numofallbots = guild.roles.cache.get(botroleid).members.size
    const numofallmembnobots = (numofallmemb - numofallbots).toLocaleString()
    channel.setName('Members: ' + numofallmembnobots)
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