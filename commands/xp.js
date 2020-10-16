const { con } = require(".././bot")
const botconfig = require("../botconfig.json")
const { createCanvas, loadImage, Canvas } = require("canvas");
const { join } = require("path");
const canvasxp = require("../handlers/xp/canvasxp")
const getrank = require("../handlers/xp/getrank")
const find_channel_by_name = require("../handlers/channelfinder/find_channel_by_name")

const name = "xp"
const description = `Vypíše počet XP`
const usage = `${botconfig.prefix}xp`
const accessableby = ["Member"]
const aliases = []

module.exports.run = async (message, args) => {
    let target = message.mentions.users.first() || message.guild.members.cache.get(args[1]) || message.author;

    con.query(`SELECT * FROM userstats WHERE id = '${target.id}'`, (err, rows) => {
        if (err) throw err;

        let hodnotyout = ({ zprava: "This user has no XP on record.", roomname: require("../botconfig/roomnames.json").botcommand })
        

        if (!rows[0]) return find_channel_by_name.run(hodnotyout)
        let xp = rows[0].xp
        let level = rows[0].level
        let rank = rows[0].user_rank
        var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
        var callfunction = canvasxp.run
        getrank.run(xp, level, con, target, message, xpToNextLevel, callfunction, rank)
    })
}


module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}