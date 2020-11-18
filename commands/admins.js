const Discord = require("discord.js");
const bot = require("../bot");
const { prefix } = require("../botconfig.json")
const adminroles = require("../botconfig/adminroles.json")
const color = require("../colorpaletes/colors.json")
const adminsoutput = require("../handlers/admins/adminsoutput")

const name = "admins"
const description = `Vypíše seznam členů Admin teamu.`
const usage = `${prefix}admins`
const accessableby = ["Member"]
const aliases = ["at"]

module.exports.run = async (message) => {
    let hodnoty = ({ discord: Discord, adminlist: adminroles, color: color, message: message })
    adminsoutput.run(hodnoty)

    /*const numofroles = botconfig.admins_roles.length
    const rolesid = []
    for (r = 0; r < numofroles; r++) {
        rolesid.push(message.guild.roles.cache.find(rla => rla.name === botconfig.admins_roles[r]).id)
    }
    const rolesname = botconfig.admins_roles

    function listofat(embed) {
        for (var i = 0; i < numofroles; i++) {
            const role = rolesname[i].toString()
            const usernames = message.guild.roles.cache.get(rolesid[i]).members.map(m => m.user.tag).join('\n').toString()
            embed.addFields({ name: role || `Žádná role s názvem ${rolesname[i]}`, value: usernames || 'Žádný člen role', inline: true })
        }
    }

    var embed = new Discord.MessageEmbed()
        .setColor(color.red)
    listofat(embed)
    message.channel.send(embed)
*/
}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}