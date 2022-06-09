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

async function FilterServers() {}

async function CheckIfTableExist({ guildIDs }) {
  return new Promise(async (resolve, reject) => {
    let RawTables = await ExecuteQuery({ sql: "SHOW TABLES" });
    let TableIDs = [];
    let ServersIDs = [];

    //console.info(guildIDs);

    for (g in guildIDs) {
      let guildID = guildIDs[g];

      if (!ServersIDs.includes(guildID)) {
        ServersIDs.push(guildID);
      }
      //console.info(guildID);

      //Raw Tables => Result of query
      for (RawTableID in RawTables) {
        //Defining per Table variables
        let Table = JSON.parse(JSON.stringify(RawTables[RawTableID]));
        let TableIDArray = Table[Object.keys(Table)[0]].split("_");
        let TableID = TableIDArray[0];
        let TableType = TableIDArray[1];

        if (TableType != "config" && TableType != "userstats") continue;

        if (!TableIDs.includes(TableID)) {
          TableIDs.push(TableID);
        }
        /*await ExecuteQuery({
        } else if (!guildIDs.includes(TableID)) {
          console.info("Here");
          let sqlDROP = `DROP TABLE IF EXISTS ${TableID}_${TableType}`;
            sql: sqlDROP
          }
        });*/
      }
    }

    console.info({ TableIDs, ServersIDs });
    let NotRegisteredConfig = ServersIDs.filter((item) => {
      if (TableIDs.length <= 0) return true;

      if (!TableIDs.includes(item)) return true;
      else return false;
    });

    let NotExistingConfig = TableIDs.filter((item) => {
      if (ServersIDs.length <= 0) return true;

      if (!ServersIDs.includes(item)) return true;
      else return false;
    });

    console.info({ NotRegisteredConfig, NotExistingConfig });

    for (NRCID in NotRegisteredConfig) {
      let NRC = NotRegisteredConfig[NRCID];
      await CreateGuildDB({ guildID: NRC });
    }

    for (NECID in NotExistingConfig) {
      let NEC = NotExistingConfig[NECID];
      let sqlDROP = `DROP TABLE IF EXISTS ${NEC}_config`;
      delete GuildsConfigs[NEC]
      await ExecuteQuery({
        sql: sqlDROP
      });
    }

    //if (true) return;
    resolve();
  });
}

module.exports = async ({ guildIDs }) => {
  //console.info(guildIDs);
  await CheckIfTableExist({ guildIDs });

  let GuildConfig = await GetRawDatas({ guildIDs });

  await CreateConfigJSON({ GuildConfig, guildIDs });
};
