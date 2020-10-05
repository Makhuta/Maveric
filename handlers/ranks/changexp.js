module.exports = {
    run: (hodnoty) => {
        hodnoty.sql = `UPDATE userstats SET xp = ${hodnoty.xp} WHERE id = '${hodnoty.user.id}'`;
            hodnoty.con.query(hodnoty.sql)
    }
}