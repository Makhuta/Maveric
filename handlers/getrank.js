require("module-alias/register");
require("dotenv").config();
const xp_stats = require("@configs/xp_stats.json")
const { database } = require("@events/local_database")

var rank
var resid
var resallxp
var vsechnyxpecka

function allxp(level, xp, someid, userid) {
    if (someid === userid) {
        var xpecka = xp
    } else {
        var xpecka = xp
    }
    for (let l = 0; l < level; l++) {
        var xpToNextLevel = 5 * Math.pow(l, 2) + 50 * l + 100;
        xpecka = xpecka + xpToNextLevel;
    }
    return (xpecka)
}



module.exports = {
    run: async(xp, level, target, message, xpToNextLevel, callfunction, response) => {
        //con.query(`SELECT id, xp, level FROM userstats`, function(err, result, fields) {
        //if (err) throw err;
        var usraray = []
        var reslength = database.length - 1

        database.forEach(user => {
            resid = user.id;
            let reslevel = user.level;
            let resxp = user.xp;
            resallxp = xp_stats[reslevel].total_xp_from_zero + resxp
            usraray.push({ id: resid, allxps: resallxp })
        });

        /*for (let d = 0; d <= reslength; d++) {
            resid = database[d].id;
            let reslevel = database[d].level;
            let resxp = database[d].xp;
            resallxp = allxp(reslevel, resxp, resid, target.id)
            usraray.push({ id: resid, allxps: resallxp })
        }*/
        //console.log(usraray)

        usraray.sort((a, b) => (a.allxps < b.allxps) ? 1 : (a.allxps === b.allxps) ? ((a.id < b.id) ? 1 : -1) : -1)


        //console.log(usraray)

        usraray.forEach((user, i) => {
            if (user.id == target.id) {
                rank = i + 1;
                vsechnyxpecka = xp_stats[level].total_xp_from_zero + xp
                //console.log(vsechnyxpecka)
                callfunction(xp, level, target, message, xpToNextLevel, rank, vsechnyxpecka, response)
            }
        })

        /*for (let d = 0; d <= reslength; d++) {
            if (usraray[d].id === target.id) {
                rank = d + 1
                vsechnyxpecka = allxp(level, xp)

                callfunction(xp, level, target, message, xpToNextLevel, rank, vsechnyxpecka, response)
            }
        }*/
        //});
    }
}