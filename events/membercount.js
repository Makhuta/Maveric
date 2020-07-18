const { bot } = require('../bot');
const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const { Guild } = require('discord.js');
const color = require("../colors.json")
const Canvas = require('canvas')


    const updateMembers = guild => {
        const channel = guild.channels.cache.get(botconfig.membercountid)
        channel.setName('Members: ' + guild.memberCount.toLocaleString())
        console.log(guild.memberCount.toLocaleString())
    }

    bot.on('ready', () => {
        const guild = bot.guilds.cache.get(botconfig.guildid)
        updateMembers(guild)
    });

    bot.on("guildMemberAdd", member => {
        updateMembers(member.guild)
    });
    
    bot.on("guildMemberRemove", member => {
        updateMembers(member.guild)
    });