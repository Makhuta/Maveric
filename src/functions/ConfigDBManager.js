let { join } = require("path");
const { isUndefined } = require("util");
let ExecuteQuery = require(join(Functions, "DBExecuter.js"));

async function ConfigExist({ searchvalue, JSONobj }) {
  if (!isUndefined(JSONobj[searchvalue])) return true;
  else return false;
}

async function PerConfigLoop({ JSONobj, TestJSON, Arrayobj }) {
  for (ConfigName in JSONobj) {
    let value = JSONobj[ConfigName];
    let CFGExist = await ConfigExist({
      searchvalue: ConfigName,
      JSONobj: TestJSON
    });
    if (!CFGExist) {
      Arrayobj.push({ name: ConfigName, value });
    }
  }
}

async function GetConfigStats({ ExistingJSON, DatabaseJSON, guildID }) {
  let NotExistingConfigs = [];
  let NotRegisteredConfigs = [];

  await PerConfigLoop({
    JSONobj: ExistingJSON,
    TestJSON: DatabaseJSON,
    Arrayobj: NotRegisteredConfigs
  });

  await PerConfigLoop({
    JSONobj: DatabaseJSON,
    TestJSON: ExistingJSON,
    Arrayobj: NotExistingConfigs
  });

  return {
    NotExistingConfigs: { guild: guildID, configs: NotExistingConfigs },
    NotRegisteredConfigs: { guild: guildID, configs: NotRegisteredConfigs }
  };
}

async function ConfigDBManager({ type, guildIDs, ExistingConfigs }) {
  let sql;

  for (guildID of guildIDs) {
    let GuildConfig = GuildsConfigs[guildID];
    let DatabaseJSON = GuildConfig?.config;

    let { NotExistingConfigs, NotRegisteredConfigs } = await GetConfigStats({
      ExistingJSON: ExistingConfigs,
      DatabaseJSON,
      guildID
    });

    switch (type) {
      case "INSERT":
        if (NotRegisteredConfigs.configs.length == 0) continue;
        let sqlVALUES = `(config_name, config_value) VALUES `;
        for (NRCID in NotRegisteredConfigs.configs) {
          let NRC = NotRegisteredConfigs.configs[NRCID];
          if (NotRegisteredConfigs.configs.length - 1 > NRCID) {
            sqlVALUES = sqlVALUES + `("${NRC.name}", "${NRC.value}"), `;
          } else {
            sqlVALUES = sqlVALUES + `("${NRC.name}", "${NRC.value}") `;
          }
        }
        sql = `INSERT INTO ${guildID}_config ${sqlVALUES} ON DUPLICATE KEY UPDATE config_name=VALUES(config_name), config_value=VALUES(config_value);`;
        await ExecuteQuery({ sql });

        break;
      case "DELETE":
        if (NotExistingConfigs.configs.length == 0) continue;
        let sqlWHERE = `WHERE `;
        for (NECID in NotExistingConfigs.configs) {
          let NEC = NotExistingConfigs.configs[NECID];
          if (NotExistingConfigs.configs.length - 1 > NECID) {
            sqlWHERE = sqlWHERE + `config_name="${NEC.name}" AND `;
          } else {
            sqlWHERE = sqlWHERE + `config_name="${NEC.name}" `;
          }
        }
        sql = `DELETE FROM ${guildID}_config ${sqlWHERE};`;
        await ExecuteQuery({ sql });
        break;
    }
  }
}

module.exports = ConfigDBManager;
