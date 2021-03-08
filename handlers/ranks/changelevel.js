module.exports = {
    run: async(hodnoty) => {
        if (hodnoty.type === "rankup") {
            for (hodnoty.xp; hodnoty.xp >= hodnoty.xpToNextLevel; hodnoty.xp) {

                if (hodnoty.level < 40) {
                    hodnoty.level++
                        hodnoty.xp = hodnoty.xp - hodnoty.xpToNextLevel
                } else {
                    hodnoty.xp = hodnoty.xpToNextLevel
                    hodnoty.sql = `UPDATE userstats SET xp = ${hodnoty.xp} WHERE id = '${hodnoty.user.id}'`;
                    hodnoty.con.query(hodnoty.sql)
                    return
                }
                hodnoty.xpToNextLevel = 5 * Math.pow(hodnoty.level, 2) + 50 * hodnoty.level + 100


                hodnoty.sql = `UPDATE userstats SET xp = ${hodnoty.xp} WHERE id = '${hodnoty.user.id}'`;
                hodnoty.con.query(hodnoty.sql)
                hodnoty.sql = `UPDATE userstats SET level = ${hodnoty.level} WHERE id = '${hodnoty.user.id}'`;
                hodnoty.con.query(hodnoty.sql)
            }
            require("./rankup_picture").run(hodnoty.message, hodnoty.level, hodnoty.user)

            hodnoty.sql = `UPDATE userstats SET xp = ${hodnoty.xp} WHERE id = '${hodnoty.user.id}'`;
            hodnoty.con.query(hodnoty.sql)
            hodnoty.sql = `UPDATE userstats SET level = ${hodnoty.level} WHERE id = '${hodnoty.user.id}'`;
            hodnoty.con.query(hodnoty.sql)
        } else if (hodnoty.type === "rankdown") {
            for (hodnoty.xp; hodnoty.xp < 0; hodnoty.xp) {
                if (hodnoty.level > 0) {
                    hodnoty.level--;
                    hodnoty.xpToNextLevel = 5 * Math.pow(hodnoty.level, 2) + 50 * hodnoty.level + 100
                    hodnoty.xp = hodnoty.xp + hodnoty.xpToNextLevel
                } else if (hodnoty.level = 0 && hodnoty.xp <= -100) {
                    hodnoty.xp = 0;
                    hodnoty.sql = `UPDATE userstats SET xp = ${hodnoty.xp} WHERE id = '${hodnoty.user.id}'`;
                    hodnoty.con.query(hodnoty.sql)
                    return
                }
                hodnoty.sql = `UPDATE userstats SET xp = ${hodnoty.xp} WHERE id = '${hodnoty.user.id}'`;
                hodnoty.con.query(hodnoty.sql)
                hodnoty.sql = `UPDATE userstats SET level = ${hodnoty.level} WHERE id = '${hodnoty.user.id}'`;
                hodnoty.con.query(hodnoty.sql)
            }
            require("./rankdown_picture").run(hodnoty.message, hodnoty.level, hodnoty.user)

            hodnoty.sql = `UPDATE userstats SET xp = ${hodnoty.xp} WHERE id = '${hodnoty.user.id}'`;
            hodnoty.con.query(hodnoty.sql)
            hodnoty.sql = `UPDATE userstats SET level = ${hodnoty.level} WHERE id = '${hodnoty.user.id}'`;
            hodnoty.con.query(hodnoty.sql)
        }
    }
}