require("module-alias/register");
require("dotenv").config();
const xp_stats = require("@configs/xp_stats.json")
const { database } = require("@events/local_database")
const { bot } = require('@src/bot');
const database_access = require("@handlers/database_access");

async function xp_too_high(xp, level, id, message, target, userstats) {
    let user_data = userstats
    let xpToNextLevel = xp_stats[level].xpToNextLevel
        //console.log("XP: " + xp + " XP to next Level: " + xpToNextLevel)
    if (xp >= xpToNextLevel && level < 40) {
        //console.log("if")
        level++;
        xp = xp - xpToNextLevel;
        userstats = user_data
        xp_too_high(xp, level, id, message, target, userstats)
    } else if (xp > xpToNextLevel && level >= 40) {
        //console.log("else if")
        user_data.xp = xp = xpToNextLevel
        userstats = user_data
        xp_too_high(xp, level, id, message, target, userstats)
    } else {
        //console.log("else")
        //console.log("XP: " + xp + " XP to next Level: " + xpToNextLevel)
        user_data.xp = xp;
        user_data.level = level;
        userstats = user_data
        //console.log("before")
        await database_access.set(message, target, user_data)
        //console.log("after")
        require("./rankup_picture").run(message, level, target)
    }
}

async function xp_too_low(xp, level, id, message, target, userstats, level_before) {
    let user_data = userstats
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
        userstats = user_data
        xp_too_low(xp, level, id, message, target, userstats, level_before)
    } else if (xp < 0 && level_before <= 0) {
        //console.log("else if")

        user_data.xp = xp = 0
        userstats = user_data
        xp_too_low(xp, level, id, message, target, userstats, level_before)
    } else {
        //console.log("else")

        //console.log("XP: " + xp + " XP to next Level: " + xpToNextLevel)
        user_data.xp = xp;
        user_data.level = level_before;
        userstats = user_data
        await database_access.set(message, target, user_data)
        require("./rankdown_picture").run(message, level_before, target)
    }
}

module.exports = {
    run: async(id, message, target) => {
        let userstats = await database_access.get(message, target);
        let level = userstats.level

        //console.log(userstats)
        if (userstats.xp >= 0) {
            if (userstats.xp >= xp_stats[level].xpToNextLevel) {
                await xp_too_high(userstats.xp, level, id, message, target, userstats)
            }


        } else {
            let level_before = level
            //console.log("below zero")
                /*if (level <= 0) {
                    level = 0
                } else {
                    level = level - 1
                }*/
            //console.log(level)
            //console.log(xp_stats[level])
            if (userstats.xp < xp_stats[level].xpToNextLevel || 0) {
                level--
                await xp_too_low(userstats.xp, level, id, message, target, userstats, level_before)
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