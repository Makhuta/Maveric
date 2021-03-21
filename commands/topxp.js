require("module-alias/register");
require("dotenv").config();
const { bot } = require('@src/bot');
const top10canvasxp = require("@canvases/top10canvasxp")
const xp_stats = require("@configs/xp_stats.json")
const database_access = require("@handlers/database_access")

const name = "topxp"
const accessableby = ["Member"]
const aliases = ["txp"]
const response = "COMMAND_ROOM_NAME";

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }

function allxp(level, xp) {
    var xpecka = xp
    for (let l = 0; l < level; l++) {
        var xpToNextLevel = 5 * Math.pow(l, 2) + 50 * l + 100;
        xpecka = xpecka + xpToNextLevel;
    }
    /*sql = `UPDATE userstats SET allxp = ${xpecka} WHERE id = '${target.id}'`;
    con.query(sql)*/
    return (xpecka)
}

module.exports.run = async(message, args, botconfig, user_lang_role) => {

    let strana = args[0] ? args[0] : 0

    if (strana != 0) --strana

    let result = await database_access.get(message)
    var usraray = []
    var top10 = []
    var undefinedaray = [{ id: "No user", xp: "undefined", level: "No user", username: "No username", discriminator: "0000" }]
    var reslevel
    var resxp
    var reslength0 = result.length - 1




    result.forEach(user => {
        user_id = user.id;
        user_level = user.level;
        user_xp = user.xp;
        user_all_xp = xp_stats[user_level].total_xp_from_zero + user_xp
        usraray.push({ id: user_id, allxps: user_all_xp, xp: user_xp, level: user_level })
    });
    //console.log(usraray)
        //return
        /*for (let d = 0; d <= reslength0; d++) {
            resid = result[d].id;
            reslevel = result[d].level;
            resxp = result[d].xp;
            resallxp = allxp(reslevel, resxp)
            usraray.push({ id: resid, allxps: resallxp, xp: resxp, level: reslevel })
        }*/
    usraray.sort((a, b) => (a.allxps < b.allxps) ? 1 : (a.allxps === b.allxps) ? ((a.id < b.id) ? 1 : -1) : -1)

    for (let d = (10 * strana); d < (10 * strana + 10); d++) {
        let topid = (usraray[d] || undefinedaray[0]).id
        let topxp = (usraray[d] || undefinedaray[0]).xp
        let toplevel = (usraray[d] || undefinedaray[0]).level
        let username = (bot.users.cache.get(topid) || undefinedaray[0]).username + " #" + (bot.users.cache.get(topid) || undefinedaray[0]).discriminator
        let user = bot.users.cache.get(topid)



        top10.push({ id: topid, username: username, xp: topxp, level: toplevel, rank: d + 1, user: user })

        //console.log(top10)
    }
    top10canvasxp.run(top10, message, response, botconfig)
}




module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases
}