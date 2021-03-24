require("module-alias/register");
require("dotenv").config();
const { database } = require("@events/local_database")
const { bot } = require("@src/bot")
const canvasprofile = require("@canvases/canvasprofile")
const xp_stats = require("@configs/xp_stats.json")
const moment = require("moment")
const database_access = require("@handlers/database_access")

const name = "profile"
const accessableby = ["Member"]
const aliases = ["xp", "pr"]
const response = "COMMAND_ROOM_NAME";
const category = ["Statistics", "All"]

async function getrank(usraray, user_rank, target, message) {
    let all_users = await database_access.get(message)
    all_users.forEach(user => {
        resid = user.id;
        let reslevel = user.level;
        let resxp = user.xp;
        resallxp = xp_stats[reslevel].total_xp_from_zero + resxp
        usraray.push({ id: resid, allxps: resallxp })
    });

    usraray.sort((a, b) => (a.allxps < b.allxps) ? 1 : (a.allxps === b.allxps) ? ((a.id < b.id) ? 1 : -1) : -1)


    usraray.forEach((user, i) => {
        if (user.id == target.id) {
            user_rank = i + 1;
        }
    })

    return user_rank
}


module.exports.run = async(message, args, botconfig, user_lang_role) => {
    let target = message.mentions.users.first() || message.author
    let more_about_target = message.guild.members.cache.get(target.id)
    let user_data = await database_access.get(message, target)
    let xp = user_data.xp
    let level = user_data.level
    let tier = user_data.tier
    let xpToNextLevel = xp_stats[level].xpToNextLevel
    let allxp = xp_stats[level].total_xp_from_zero + xp
    let createdate = moment(target.createdAt).format('D. M. YYYY')
    let joindate = moment(more_about_target.joinedTimestamp).format('D. M. YYYY')
    let roles_map = more_about_target.roles //.filter(role => role.name != "@everyone").filter(role => role.name.split(":")[0] != "Language")
    let roles = roles_map.highest.name
    let user_language = await require("@events/language_load").languages.get(user_lang_role).get("PROFILE")
        /*roles_map.forEach(role => {
            roles.unshift(role.name)
        })
        roles = roles.join(", ")*/
    var user_rank
    user_rank = await getrank([], user_rank, target, message)

    var user_profile = { message: message, response: response, id: target.id, target: target, username: target.username, discriminator: "#" + target.discriminator, xp: xp, level: level, tier: tier, xpToNextLevel: xpToNextLevel, allxp: allxp, createdate: createdate, joindate: joindate, roles: roles, language: user_language, language_name: user_lang_role, user_rank: user_rank }


    canvasprofile(user_profile)
        //console.log(user_profile)




}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases,
    category: category
}