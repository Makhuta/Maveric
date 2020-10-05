module.exports = {
    run: (hodnoty) => {
        let Discord = hodnoty.discord
        let adminlist = hodnoty.adminlist
        let color = hodnoty.color
        let message = hodnoty.message
        const numofroles = adminlist.length
        const rolesid = []
        for (r = 0; r < numofroles; r++) {
            rolesid.push(message.guild.roles.cache.find(rla => rla.name === adminlist[r]).id)
        }
        function listofat(embed) {
            for (var i = 0; i < numofroles; i++) {
                const role = adminlist[i].toString()
                const usernames = message.guild.roles.cache.get(rolesid[i]).members.map(m => m.user.tag).join('\n').toString()
                embed.addFields({ name: role || `Žádná role s názvem ${adminlist[i]}`, value: usernames || 'Žádný člen role', inline: true })
            }
        }

        var embed = new Discord.MessageEmbed()
            .setColor(color.red)
        listofat(embed)
        message.channel.send(embed)
    }
}