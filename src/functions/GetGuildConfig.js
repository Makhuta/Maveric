let { join } = require("path");
let ExecuteQuery = require(join(Functions, "DBExecuter.js"));
let CreateGuildDB = require(join(Functions, "CreateGuildDB.js"));

async function GetRawDatas({ guildIDs }) {
  let sqlSELECT = "SELECT ";
  let sqlFROM = "FROM ";

  for (g in guildIDs) {
    let gID = guildIDs[g];
    if (guildIDs.length - 1 > g) {
      sqlSELECT =
        sqlSELECT +
        `Guild${g}.config_name AS ${gID}_NAME, Guild${g}.config_VALUE AS ${gID}_VALUE, `;
      sqlFROM = sqlFROM + `${gID}_config AS Guild${g}, `;
    } else {
      sqlSELECT =
        sqlSELECT +
        `Guild${g}.config_name AS ${gID}_NAME, Guild${g}.config_VALUE AS ${gID}_VALUE `;
      sqlFROM = sqlFROM + `${gID}_config AS Guild${g} `;
    }
  }

  let sql = sqlSELECT + sqlFROM;

  let GuildConfig = await ExecuteQuery({ sql });
  return GuildConfig;
}

async function CreateConfigJSON({ GuildConfig, guildIDs }) {
  for (g in guildIDs) {
    let configs = {};
    let guildID = guildIDs[g];
    for (GCID in GuildConfig) {
      let GC = JSON.parse(JSON.stringify(GuildConfig[GCID]));
      let guildConfigName = GC[`${guildID}_NAME`];
      let guildConfigValue = GC[`${guildID}_VALUE`];

      configs[guildConfigName] = guildConfigValue;
    }
    GuildsConfigs[guildID] = { config: configs };
  }
}

async function CheckIfTableExist({ guildIDs }) {
  return new Promise(async (resolve, reject) => {
    let RawTables = await ExecuteQuery({ sql: "SHOW TABLES" });
    let TableIDs = [];
    let ServersIDs = [];

    for (g in guildIDs) {
      let guildID = guildIDs[g];
      for (RawTableID in RawTables) {
        let Table = JSON.parse(JSON.stringify(RawTables[RawTableID]));
        let TableIDArray = Table[Object.keys(Table)[0]].split("_");
        let TableID = TableIDArray[0];
        let TableType = TableIDArray[1];

        if (TableType != "config" && TableType != "userstats") continue;

        if (!TableIDs.includes(TableID) && guildIDs.includes(TableID)) {
          TableIDs.push(TableID);
        } else if (!guildIDs.includes(TableID)) {
          console.info("Here")
          let sqlDROP = `DROP TABLE IF EXISTS ${TableID}_${TableType}`;
          await ExecuteQuery({
            sql: sqlDROP
          });
        }
      }
      for (TableIDID in TableIDs) {
        let TableID = TableIDs[TableIDID];
        if (!TableIDs.includes(guildID) && TableID != guildID) {
          ServersIDs.push(guildID);
        }
      }
    }

    for (ServerIDID in ServersIDs) {
      let ServerID = ServersIDs[ServerIDID];
      await CreateGuildDB({ guildID: ServerID });
    }
    resolve();
  });
}

module.exports = async ({ guildIDs }) => {
  await CheckIfTableExist({ guildIDs });
  let GuildConfig = await GetRawDatas({ guildIDs });

  await CreateConfigJSON({ GuildConfig, guildIDs });
};
