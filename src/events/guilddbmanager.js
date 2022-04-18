const { client, NSBR } = require(DClientLoc);
const { join } = require("path");

NSBR.on("UserstatInit", async ({ id }) => {
  let guild = await client.guilds.fetch(id);
  let members = await guild.members.fetch();
  let sql = [`INSERT INTO ${id}_userstats (id) VALUES`];
  for (let m of members) {
    let member = m[0];
    if (sql.length == 1) {
      sql.push(` (${member})`);
    } else {
      sql.push(`,(${member})`);
    }
  }
  sql.push(" ON DUPLICATE KEY UPDATE id=VALUES(id);");
  sql = sql.join("");
  console.info(await PoolAccess.ExecuteQuery({ sql }));
});

NSBR.on("ConfigInit", async ({ id }) => {
  let sql = [`INSERT INTO ${id}_config (config_name, config_value) VALUES`];
  let cfgs = require(join(configs, "defaultvariables.json"));
  for (let c of cfgs) {
    if (sql.length == 1) {
      sql.push(` ("${c.name}", "${c.value}")`);
    } else {
      sql.push(`,("${c.name}", "${c.value}")`);
    }
  }
  sql.push(";");
  sql = sql.join("");
  console.info(await PoolAccess.ExecuteQuery({ sql }));
});

client.on("guildCreate", async (guild) => {
  let guildID = guild.id;
  let sql_userstats = `CREATE TABLE ${guildID}_userstats (id BIGINT(20) PRIMARY KEY, money INT DEFAULT "0", bank INT DEFAULT "0")`;
  console.info(await PoolAccess.ExecuteQuery({ sql: sql_userstats }));
  NSBR.emit("UserstatInit", guild);

  let sql_config = `CREATE TABLE ${guildID}_config (config_name VARCHAR(45) PRIMARY KEY, config_value VARCHAR(45))`;
  console.info(await PoolAccess.ExecuteQuery({ sql: sql_config }));
  NSBR.emit("ConfigInit", guild);
});

client.on("guildDelete", async (guild) => {
  let guildID = guild.id;
  let sql_userstats = `DROP TABLE ${guildID}_userstats`;
  console.info(await PoolAccess.ExecuteQuery({ sql: sql_userstats }));

  let sql_config = `DROP TABLE ${guildID}_config`;
  console.info(await PoolAccess.ExecuteQuery({ sql: sql_config }));
});
