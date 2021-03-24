require("module-alias/register");
require("dotenv").config();
const Discord = require("discord.js");
const adminroles = require("@configs/adminroles.json")
const color = require("@colorpaletes/colors.json")

const name = "admins"
const accessableby = ["Member"]
const aliases = ["at"]
const response = "COMMAND_ROOM_NAME"
const category = ["Info", "All"]

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("ADMINS")
    const rolesid = []

    adminroles.forEach(role => {
        rolesid.push(message.guild.roles.cache.find(rla => rla.name === role).id)
    });

    function listofat(embed) {
        adminroles.forEach((role, i) => {
            const usernames = message.guild.roles.cache.get(rolesid[i]).members.map(m => m.user.tag).join('\n').toString()
            embed.addFields({ name: role || user_language.NO_ROLE.replace("&ROLENAME", role), value: usernames || user_language.NO_MEMBER, inline: true })
        })
    }

    var embed = new Discord.MessageEmbed()
        .setColor(color.red)
    listofat(embed)
    let hodnotyout = ({ zprava: embed, roomname: botconfig.find(config => config.name == response).value, message: message })
    require("@handlers/find_channel_by_name").run(hodnotyout)

}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases,
    category: category
}