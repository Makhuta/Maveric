const { bot } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const { Guild } = require('discord.js');
const color = require("../colors/colors.json")
const Canvas = require('canvas')


const updateMembers = guild => {
    const onlinechannel = guild.channels.cache.get(botconfig.onlinecountid)
    const offlinechannel = guild.channels.cache.get(botconfig.offlinecountid)
    const numofallmemb = guild.memberCount.toLocaleString()
    const botroleid = guild.roles.cache.find(r => r.name === botconfig.botrolename).id
    const numofallbots = guild.roles.cache.get(botroleid).members.size.toLocaleString()
    const numofallmembnobots = (numofallmemb - numofallbots).toLocaleString()
    const offlinecount = (guild.members.cache.filter(m => m.presence.status === 'offline').size.toString())
    const online = guild.members.cache.filter(m => m.presence.status === 'online').size
    const dnd = guild.members.cache.filter(m => m.presence.status === 'dnd').size
    const idle = guild.members.cache.filter(m => m.presence.status === 'idle').size
    const onlinecount = ((online + dnd + idle) - numofallbots)//.toLocaleString()
    onlinechannel.setName('Online: ' + onlinecount)
    offlinechannel.setName('Offline: ' + offlinecount)
    //console.log("Online: " + online + " DND: " + dnd + " Idle: " + idle + " Online Count: " + onlinecount)
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