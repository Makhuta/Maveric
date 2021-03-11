require("module-alias/register");
require("dotenv").config();
const xp_stats = require("@configs/xp_stats.json")
const { database } = require("@events/local_database")

async function xp_too_high(xp, level, id, message, target) {
    let xpToNextLevel = xp_stats[level].xpToNextLevel
        //console.log("XP: " + xp + " XP to next Level: " + xpToNextLevel)
    if (xp >= xpToNextLevel && level < 40) {
        //console.log("if")
        level++;
        xp = xp - xpToNextLevel;
        xp_too_high(xp, level, id, message, target)
    } else if (xp > xpToNextLevel && level >= 40) {
        //console.log("else if")
        database.get(id).xp = xp = xpToNextLevel
        xp_too_high(xp, level, id, message, target)
    } else {
        //console.log("else")
        //console.log("XP: " + xp + " XP to next Level: " + xpToNextLevel)
        database.get(id).xp = xp
        database.get(id).level = level
        require("./rankup_picture").run(message, level, target)
    }
}

async function xp_too_low(xp, level, id, message, target, level_before) {
    let xpToNextLevel = xp_stats[level].xpToNextLevel
    //console.log("XP: " + xp + " XP to next Level: " + xpToNextLevel + " Level: " + level)
    if (xp < 0 && level_before > 0) {
        //console.log("if")

        level--;
        level_before--;
        xp = xp + xpToNextLevel;
        xp_too_low(xp, level, id, message, target,level_before)
    } else if (xp < 0 && level_before <= 0) {
        //console.log("else if")

        database.get(id).xp = xp = 0
        xp_too_low(xp, level, id, message, target,level_before)
    } else {
        //console.log("else")

        //console.log("XP: " + xp + " XP to next Level: " + xpToNextLevel)
        database.get(id).xp = xp
        database.get(id).level = level_before
        require("./rankdown_picture").run(message, level_before, target)
    }
}

module.exports = {
    run: async (id, message, target) => {
        let level = database.get(id).level

        //console.log(xp_stats)
        if (database.get(id).xp >= 0) {
            if (database.get(id).xp >= xp_stats[level].xpToNextLevel) {
                await xp_too_high(database.get(id).xp, level, id, message, target)
            }
            

        } else {
            let level_before = level
            if (level == 0) {
                level = level
            } else {
                level = level - 1
            }
            if (database.get(id).xp < xp_stats[level].xpToNextLevel) {
                await xp_too_low(database.get(id).xp, level, id, message, target, level_before)
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