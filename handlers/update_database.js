require("module-alias/register");
require("dotenv").config();
const { database } = require("@events/local_database")
const mail = require("@handlers/error_mail")


const { bot, pool } = require('@src/bot');

module.exports = function update_database() {
    let all_sql = []

    /*
    REPLACE INTO`table` VALUES (`id`,`col1`,`col2`) VALUES
    (1,6,1),(2,2,3),(3,9,5),(4,16,8);
    */
    all_sql.push("INSERT INTO userstats (id,xp,level,tier,last_daily_xp,last_hl) VALUES ")
    database.forEach(user => {
        if (all_sql.length == 1) {
            all_sql.push(`('${user.id}',${user.xp},${user.level},${user.tier},'${user.last_daily_xp}','${user.last_hl}')`)
        }
        /* else if ((all_sql.length - 1) < i) {
                    //all_sql.push(`SELECT ${user.id}, ${user.xp}, ${user.level}, ${user.tier}, ${user.last_daily_xp}, ${user.last_hl} UNION ALL `)
                }*/
        else {
            all_sql.push(`,('${user.id}',${user.xp},${user.level},${user.tier},'${user.last_daily_xp}','${user.last_hl}')`)
                //all_sql.push(`SELECT ${user.id}, ${user.xp}, ${user.level}, ${user.tier}, ${user.last_daily_xp}, ${user.last_hl} ) vals ON m.id = vals.id SET xp = _xp, level = _level, tier = _tier, last_daily_xp = _last_daily_xp, last_hl = _last_hl`)
        }
    });

    //all_sql.unshift("INSERT INTO userstats (id, xp, level, tier, last_daily_xp, last_hl) VALUES ")
    all_sql.push(`ON DUPLICATE KEY UPDATE id=VALUES(id), xp=VALUES(xp), level=VALUES(level), tier=VALUES(tier), last_daily_xp=VALUES(last_daily_xp), last_hl=VALUES(last_hl);`)
    all_sql = all_sql.join("")

    //console.log(all_sql)



    pool.getConnection(async function(err, con) {
        if (err) throw err;
        con.query(all_sql, function(err) {
            if (err) {
                console.log(command);
                console.log("ERROR");
                console.log(err);
                return;
            }
            let out = require("@handlers/map_to_string")(database)
            mail({
                attachment: {
                    filename: "user_database.txt",
                    content: out
                }
            })
            console.log("Database Update Succesfull.");
        });
    })
}