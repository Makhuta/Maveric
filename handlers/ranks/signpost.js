require("module-alias/register");
require("dotenv").config();
const xp_stats = require("@configs/xp_stats.json")
const { database } = require("@events/local_database")
const { bot } = require('@src/bot');

async function xp_too_high(xp, level, id, message, target) {
    let user_data = bot.userstats.get(id)
    let xpToNextLevel = xp_stats[level].xpToNextLevel
        //console.log("XP: " + xp + " XP to next Level: " + xpToNextLevel)
    if (xp >= xpToNextLevel && level < 40) {
        //console.log("if")
        level++;
        xp = xp - xpToNextLevel;
        xp_too_high(xp, level, id, message, target)
    } else if (xp > xpToNextLevel && level >= 40) {
        //console.log("else if")
        user_data.xp = xp = xpToNextLevel
        xp_too_high(xp, level, id, message, target)
    } else {
        //console.log("else")
        //console.log("XP: " + xp + " XP to next Level: " + xpToNextLevel)
        user_data.xp = xp;
        user_data.level = level;
        require("@src/bot").bot.userstats.set(id, user_data)
        require("./rankup_picture").run(message, level, target)
    }
}

async function xp_too_low(xp, level, id, message, target, level_before) {
    let user_data = bot.userstats.get(id)
    let xp_info = xp_stats[level]
    let xpToNextLevel
    if (xp_info == undefined) xpToNextLevel = 0
    else xpToNextLevel = xp_info.xpToNextLevel
        //console.log("XP: " + xp + " XP to next Level: " + xpToNextLevel + " Level: " + level)
    if (xp < 0 && level_before > 0) {
        //console.log("if")

        level--;
        level_before--;
        xp = xp + xpToNextLevel;
        xp_too_low(xp, level, id, message, target, level_before)
    } else if (xp < 0 && level_before <= 0) {
        //console.log("else if")

        user_data.xp = xp = 0
        xp_too_low(xp, level, id, message, target, level_before)
    } else {
        //console.log("else")

        //console.log("XP: " + xp + " XP to next Level: " + xpToNextLevel)
        user_data.xp = xp;
        user_data.level = level_before;
        require("@src/bot").bot.userstats.set(id, user_data)
        require("./rankdown_picture").run(message, level_before, target)
    }
}

module.exports = {
    run: async(id, message, target) => {
        let level = bot.userstats.get(id).level

        //console.log(xp_stats)
        if (bot.userstats.get(id).xp >= 0) {
            if (bot.userstats.get(id).xp >= xp_stats[level].xpToNextLevel) {
                await xp_too_high(bot.userstats.get(id).xp, level, id, message, target)
            }


        } else {
            let level_before = level
                /*if (level <= 0) {
                    level = 0
                } else {
                    level = level - 1
                }*/
            if (bot.userstats.get(id).xp < xp_stats[level].xpToNextLevel || 0) {
                level--
                await xp_too_low(bot.userstats.get(id).xp, level, id, message, target, level_before)
            }
        }

        /*
        if (hodnoty.type === "rankup") {
            var xpToNextLevel = 5 * Math.pow(hodnoty.level, 2) + 50 * hodnoty.level + 100

            if ((hodnoty.xp >= xpToNextLevel)) {
                let hodnotyout = ({ type: hodnoty.type, sql: hodnoty.sql, con: hodnoty.con, user: hodnoty.user, level: hodnoty.level, xpToNextLevel: xpToNextLevel, xp: hodnoty.xp, message: hodnoty.message })
                require("./changelevel").run(hodnotyout)
            } else {
                let hodnotyout = ({ sql: hodnoty.sql, con: hodnoty.con, user: hodnoty.user, xp: hodnoty.xp })
                require("./changexp").run(hodnotyout)
            }
        } else if (hodnoty.type === "rankdown") {
            var xpToNextLevel = 5 * Math.pow(hodnoty.level, 2) + 50 * hodnoty.level + 100

            if ((hodnoty.xp < 0)) {
                let hodnotyout = ({ type: hodnoty.type, sql: hodnoty.sql, con: hodnoty.con, user: hodnoty.user, level: hodnoty.level, xpToNextLevel: xpToNextLevel, xp: hodnoty.xp, message: hodnoty.message })
                require("./changelevel").run(hodnotyout)
            } else {
                let hodnotyout = ({ sql: hodnoty.sql, con: hodnoty.con, user: hodnoty.user, xp: hodnoty.xp })
                require("./changexp").run(hodnotyout)
            }
        } else return //console.log("No type.")*/
    }
}