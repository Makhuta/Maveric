let { join } = require("path");
const { isUndefined } = require("util");
let ExecuteQuery = require(join(Functions, "database/Executer.js"));
let CreateGuildDB = require(join(Functions, "database/CreateGuild.js"));
let DefaultFunctionsStates = require(join(Configs, "DefaultFunctionsStates.json"));

async function ConfigExist({ searchvalue, JSONobj }) {
  if (!isUndefined(JSONobj[searchvalue])) return true;
  else return false;
}

async function GetRawDatas({ guildIDs }) {
  let sqlSELECT = "SELECT ";
  let sqlFROM = "FROM ";

  for (g in guildIDs) {
    let gID = guildIDs[g];
    if (g == 0 && guildIDs.length - 1 >= g) {
      sqlSELECT = sqlSELECT + `Guild${g}.config_name AS ${gID}_NAME, Guild${g}.config_value AS ${gID}_VALUE, `;
      sqlFROM = sqlFROM + `${gID}_config AS Guild${g} JOIN `;
    } else if (guildIDs.length - 1 > g) {
      sqlSELECT = sqlSELECT + `Guild${g}.config_name AS ${gID}_NAME, Guild${g}.config_value AS ${gID}_VALUE, `;
      sqlFROM = sqlFROM + `${gID}_config AS Guild${g} ON Guild${g}.config_name = Guild0.config_name JOIN `;
    } else {
      sqlSELECT = sqlSELECT + `Guild${g}.config_name AS ${gID}_NAME, Guild${g}.config_value AS ${gID}_VALUE `;
      sqlFROM = sqlFROM + `${gID}_config AS Guild${g} ON Guild${g}.config_name = Guild0.config_name `;
    }
  }

  let sql = sqlSELECT + sqlFROM;

  let GuildConfig = await ExecuteQuery({ sql });
  return GuildConfig;
}

async function CreateConfigJSON({ GuildConfig, guildIDs }) {
  for (g in guildIDs) {
    let config = {};
    let guildID = guildIDs[g];
    for (GCID in GuildConfig) {
      let GC = JSON.parse(JSON.stringify(GuildConfig[GCID]));
      let guildConfigName = GC[`${guildID}_NAME`];
      let guildConfigValue = GC[`${guildID}_VALUE`];

      if (guildConfigName.includes("ENABLED") || guildConfigName.includes("ADVERTISEMENT")) {
        config[guildConfigName] = guildConfigValue == "true";
      } else {
        config[guildConfigName] = guildConfigValue;
      }

      let DefaultFunctionsStatesFound = DefaultFunctionsStates.find((e) => e.name == guildConfigName);
      if ((DefaultFunctionsStatesFound || false) && (DefaultFunctionsStatesFound.possibleInit?.length > 0 || false)) {
        for (DFStateEnabled of DefaultFunctionsStatesFound.possibleInit) {
          config[`${DFStateEnabled}_ENABLED`] = true;
        }
      }
    }
    GuildsConfigs[guildID] = { config };
  }
}

async function CheckIfTableExist({ guildIDs }) {
  return new Promise(async (resolve, reject) => {
    let RawTables = await ExecuteQuery({ sql: "SHOW TABLES" });
    let TableIDs = [];
    let ServersIDs = [];

    for (g in guildIDs) {
      let guildID = guildIDs[g];

      if (!ServersIDs.includes(guildID)) {
        ServersIDs.push(guildID);
      }

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
      }
    }

    let NotRegisteredConfig = ServersIDs.filter((item) => {
      if (TableIDs.length <= 0) return true;

      if (!TableIDs.includes(item)) return true;
      else return false;
    });

    let NotExistingConfig = TableIDs.filter((item) => {
      if ((ServersIDs.length <= 0 || !ServersIDs.includes(item)) && item != "client") return true;
      else return false;
    });

    for (NRCID in NotRegisteredConfig) {
      let NRC = NotRegisteredConfig[NRCID];
      await CreateGuildDB({ guildID: NRC });
    }

    for (NECID in NotExistingConfig) {
      let NEC = NotExistingConfig[NECID];
      let sqlDROP = `DROP TABLE IF EXISTS ${NEC}_config`;
      delete GuildsConfigs[NEC];
      await ExecuteQuery({
        sql: sqlDROP
      });
    }
    resolve();
  });
}

module.exports = async ({ guildIDs }) => {
  await CheckIfTableExist({ guildIDs: [...guildIDs, "client"] });

  let GuildConfig = await GetRawDatas({ guildIDs });

  await CreateConfigJSON({ GuildConfig: [...GuildConfig], guildIDs: [...guildIDs] });
};
