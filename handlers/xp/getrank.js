var rank
var resid
var resallxp
var vsechnyxpecka

function allxp(level, xp, someid, userid) {
    if (someid === userid) {
        var xpecka = xp
    }
    else {
        var xpecka = xp
    }
    for (let l = 0; l < level; l++) {
        var xpToNextLevel = 5 * Math.pow(l, 2) + 50 * l + 100;
        xpecka = xpecka + xpToNextLevel;
    }
    return (xpecka)
}



module.exports = {
    run: async (xp, level, con, target, message, xpToNextLevel, callfunction) => {
        con.query(`SELECT id, xp, level FROM userstats`, function (err, result, fields) {
            if (err) throw err;
            var usraray = []
            var reslength = result.length - 1
            for (let d = 0; d <= reslength; d++) {
                resid = result[d].id;
                let reslevel = result[d].level;
                let resxp = result[d].xp;
                resallxp = allxp(reslevel, resxp, resid, target.id)
                usraray.push({ id: resid, allxps: resallxp })
            }
            usraray.sort((a, b) => (a.allxps < b.allxps) ? 1 : (a.allxps === b.allxps) ? ((a.id < b.id) ? 1 : -1) : -1)

            for (let d = 0; d <= reslength; d++) {
                if (usraray[d].id === target.id) {
                    rank = d + 1
                    vsechnyxpecka = allxp(level, xp)

                    callfunction(xp, level, target, message, xpToNextLevel, rank, vsechnyxpecka)
                }
            }
        });
    }
}