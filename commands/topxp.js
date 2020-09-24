const { bot, con } = require('../bot');
const { MessageAttachment } = require("discord.js");
const botconfig = require("../botconfig.json")
const color = require("../colors/colors.json")
const fs = require("fs");
const { createCanvas, loadImage, Canvas } = require("canvas");
const { join } = require("path");
const { createGzip } = require("zlib");
const top10canvasxp = require("../funkce/top10canvasxp")

const name = "topxp"
const description = `Vypíše XP top 10ti členů`
const usage = `${botconfig.prefix}topxp`
const accessableby = ["Member"]
const aliases = ["txp"]

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

module.exports.run = async (bot, message, args, con) => {

    con.query(`SELECT id, xp, level FROM userstats`, function (err, result, fields) {
        if (err) throw err;
        var usraray = []
        var top10 = []
        var undefinedaray = [{ id: "No user", xp: "undefined", level: "No user", username: "No username", discriminator: "0000" }]
        var reslevel
        var resxp
        var reslength = result.length
        var reslength0 = result.length - 1
        for (let d = 0; d <= reslength0; d++) {
            resid = result[d].id;
            reslevel = result[d].level;
            resxp = result[d].xp;
            resallxp = allxp(reslevel, resxp)
            usraray.push({ id: resid, allxps: resallxp, xp: resxp, level: reslevel })
        }
        usraray.sort((a, b) => (a.allxps < b.allxps) ? 1 : (a.allxps === b.allxps) ? ((a.id < b.id) ? 1 : -1) : -1)

        for (let d = 0; d < 10; d++) {
            let topid = (usraray[d] || undefinedaray[0]).id
            let topxp = (usraray[d] || undefinedaray[0]).xp
            let toplevel = (usraray[d] || undefinedaray[0]).level
            let username = (bot.users.cache.get(topid) || undefinedaray[0]).username + " #" + (bot.users.cache.get(topid) || undefinedaray[0]).discriminator
            let user = bot.users.cache.get(topid)



            top10.push({ id: topid, username: username, xp: topxp, level: toplevel, rank: d + 1, user: user})

            //console.log(top10)
        }
        top10canvasxp.run(top10, message)
    });
}




module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}