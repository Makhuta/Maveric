module.exports = {
    run: (hodnoty) => {
        if (hodnoty.type === "rankup") {
            var xpToNextLevel = 5 * Math.pow(hodnoty.level, 2) + 50 * hodnoty.level + 100

            if ((hodnoty.xp >= xpToNextLevel)) {
                let hodnotyout = ({ type: hodnoty.type, sql: hodnoty.sql, con: hodnoty.con, user: hodnoty.user, level: hodnoty.level, xpToNextLevel: xpToNextLevel, xp: hodnoty.xp, message: hodnoty.message })
                require("./changelevel").run(hodnotyout)
            }

            else {
                let hodnotyout = ({ sql: hodnoty.sql, con: hodnoty.con, user: hodnoty.user, xp: hodnoty.xp })
                require("./changexp").run(hodnotyout)
            }
        }

        else if (hodnoty.type === "rankdown") {
            var xpToNextLevel = 5 * Math.pow(hodnoty.level, 2) + 50 * hodnoty.level + 100

            if ((hodnoty.xp < 0)) {
                let hodnotyout = ({ type: hodnoty.type, sql: hodnoty.sql, con: hodnoty.con, user: hodnoty.user, level: hodnoty.level, xpToNextLevel: xpToNextLevel, xp: hodnoty.xp, message: hodnoty.message })
                require("./changelevel").run(hodnotyout)
            }

            else {
                let hodnotyout = ({ sql: hodnoty.sql, con: hodnoty.con, user: hodnoty.user, xp: hodnoty.xp })
                require("./changexp").run(hodnotyout)
            }
        }
        else return console.log("No type.")
    }
}