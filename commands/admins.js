const Discord = require("discord.js");
const botconfig = require("../botconfig.json")
const color = require("../colors.json")
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    const ownerroleid = message.guild.roles.cache.find(rla => rla.name === botconfig.owner_role).id
    const adminroleid = message.guild.roles.cache.find(rla => rla.name === botconfig.admin_role).id
    const moderatorroleid = message.guild.roles.cache.find(rla => rla.name === botconfig.moderator_role).id
    const rolesid = [ownerroleid, adminroleid, moderatorroleid]
    const rolesname = ['Majitel', 'Admini', 'Moderátoři']

    function listofat(embed) {
        for (var i = 0; i < 3; i++) {
            //message.guild.roles.cache.find(u => u.id === rolesid[i])
            const role = rolesname[i].toString()
            const usernames = message.guild.roles.cache.get(rolesid[i]).members.map(m => m.user.tag).join(', ').toString()
            embed.addFields({ name: `${role}`, value: `${usernames}` || 'test'})
            console.log(usernames + ' ' + role)
        }
    }
    //console.log(message.guild.roles.cache)




    var embed = new Discord.MessageEmbed()
        .setColor(color.red)
    listofat(embed)
    message.channel.send(embed)

}

module.exports.help = {
    name: "admins",
    description: `Vypíše seznam členů Admin teamu`,
    usage: `${botconfig.prefix}admins`,
    accessableby: "Member",
    aliases: ["at"]
}