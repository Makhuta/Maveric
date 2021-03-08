module.exports = function(rows) {
    rows.forEach(row => {
        require("@events/local_database").database.set(row.id, { id: row.id, xp: row.xp, level: row.level, tier: row.tier, last_daily_xp: row.last_daily_xp, last_hl: row.last_hl })
    })
}