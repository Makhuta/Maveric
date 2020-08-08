const Discord = require("discord.js");
const botconfig = require("../botconfig.json")
const color = require("../colors.json")
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    const numofroles = botconfig.admins_roles.length
    const rolesid = []
    for(r = 0; r < numofroles; r++){
    rolesid.push(message.guild.roles.cache.find(rla => rla.name === botconfig.admins_roles[r]).id)
    }
    const rolesname = botconfig.admins_roles

    function listofat(embed) {
        for (var i = 0; i < numofroles; i++) {
            const role = rolesname[i].toString()
            const usernames = message.guild.roles.cache.get(rolesid[i]).members.map(m => m.user.tag).join(', ').toString()
            embed.addFields({ name: role || `Žádná role s názvem ${rolesname[i]}`, value: usernames || 'Žádný člen role'})
        }
    }

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