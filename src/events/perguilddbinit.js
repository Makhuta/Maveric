const { client, NSBR } = require(DClientLoc);
require("dotenv").config();

NSBR.on("EventsLoad", async () => {
  MySQLPool.query("SHOW TABLES", function (err, result, fields) {
    result = JSON.parse(JSON.stringify(result));
    client.guilds.fetch().then(async (guilds) => {
      const DBsArray = [];
      for (let g of guilds) {
        let guildID = g[0];
        DBsArray.push(`${guildID}_userstats`);
        DBsArray.push(`${guildID}_config`);

        if (err) throw err;

        let GuildIsInDB = result.some(
          (item) =>
            item[`Tables_in_${process.env.MYSQL_DATABASE}`] ===
            `${guildID}_userstats`
        );
        let GuildConfigIsInDB = result.some(
          (item) =>
            item[`Tables_in_${process.env.MYSQL_DATABASE}`] ===
            `${guildID}_config`
        );
        if (!GuildIsInDB) {
          let sql = `CREATE TABLE ${guildID}_userstats (id BIGINT(20) PRIMARY KEY, money INT DEFAULT "0", bank INT DEFAULT "0")`;
          console.info(await PoolAccess.ExecuteQuery({ sql }));
          NSBR.emit("UserstatInit", g[1]);
        }
        if (!GuildConfigIsInDB) {
          let sql = `CREATE TABLE ${guildID}_config (config_name VARCHAR(45) PRIMARY KEY, config_value VARCHAR(45))`;
          console.info(await PoolAccess.ExecuteQuery({ sql }));
          NSBR.emit("UserstatInit", g[1]);
        }
      }

      for (let t of result) {
        let TableName = t[`Tables_in_${process.env.MYSQL_DATABASE}`];
        let TableIsGuild = DBsArray.includes(TableName);
        if (!TableIsGuild) {
          let sql = `DROP TABLE ${TableName}`;
          console.info(await PoolAccess.ExecuteQuery({ sql }));
        }
      }
    });
  });
});
