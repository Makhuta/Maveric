//Must be on the top of every code for accessing folders more easilly
require("module-alias/register");
require("dotenv").config();



const { bot } = require('@src/bot');


const updateMembers = guild => {
    const channel = guild.channels.cache.filter(chan => chan.name.split(" ")[0] == "Members:").first()
    const numofallmemb = guild.memberCount.toLocaleString()
    const numofallbots = guild.members.cache.filter(m => m.user.bot).size
    const numofallmembnobots = (numofallmemb - numofallbots).toLocaleString()
    channel.setName('Members: ' + numofallmembnobots)
}

bot.on('ready', () => {
    let guild = bot.guilds.cache.first();
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