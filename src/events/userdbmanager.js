const { NSBR } = require(DClientLoc);

NSBR.on("userjoin", async (userID, guildID) => {
  let sql = `INSERT INTO ${guildID}_userstats (id) VALUES (${userID}) ON DUPLICATE KEY UPDATE id=VALUES(id);`;
  console.info(await PoolAccess.ExecuteQuery({ sql }));
});

NSBR.on("userleave", async (userID, guildID) => {
  let sql = `DELETE FROM ${guildID}_userstats WHERE id=${userID};`;
  console.info(await PoolAccess.ExecuteQuery({ sql }));
});
