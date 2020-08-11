const { bot } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const { Guild } = require('discord.js');
const color = require("../colors.json")


    const updateMembers = guild => {
        const channel = guild.channels.cache.get(botconfig.membercountid)
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
        }, 600000 )
    });

    bot.on("guildMemberAdd", member => {
        updateMembers(member.guild)
    });
    
    bot.on("guildMemberRemove", member => {
        updateMembers(member.guild)
    });