require("module-alias/register");
require("dotenv").config();
const { user_cache } = require('@src/bot');

module.exports = function(rows) {
    rows.forEach(row => {
        require('@src/bot').bot.userstats.set(row.id, { id: row.id, xp: row.xp, level: row.level, tier: row.tier, last_daily_xp: row.last_daily_xp, last_hl: row.last_hl, last_message: 0, last_coinflip: 0 })
        require("@events/local_database").database.set(row.id, { id: row.id, xp: row.xp, level: row.level, tier: row.tier, last_daily_xp: row.last_daily_xp, last_hl: row.last_hl, last_message: 0, last_coinflip: 0 })
    })
}