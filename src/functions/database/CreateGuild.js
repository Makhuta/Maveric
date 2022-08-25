let { join } = require("path");
let ExecuteQuery = require(join(Functions, "database/Executer.js"));
let DefaultFunctionsStates = require(join(Configs, "DefaultFunctionsStates.json")).concat(require(join(Configs, "DefaultVariables.json")));

async function CreateGuildDB({ guildID }) {
  return new Promise(async (resolve, reject) => {
    if (!guildID) {
      console.info("Define guild ID");
      resolve({});
    }
    let sql;
    sql = `CREATE TABLE IF NOT EXISTS ${guildID}_config (config_name VARCHAR(45) NOT NULL PRIMARY KEY, config_value VARCHAR(45))`;
    await ExecuteQuery({ sql });

    if (guildID != "client") {
      let sqlVALUES = "(config_name, config_value) VALUES ";
      for (DefaultFunctionID in DefaultFunctionsStates) {
        let DefaultFunction = DefaultFunctionsStates[DefaultFunctionID];
        if (DefaultFunctionsStates.length - 1 > DefaultFunctionID) {
          sqlVALUES = sqlVALUES + `("${DefaultFunction.name}", "${DefaultFunction.value}"), `;
        } else {
          sqlVALUES = sqlVALUES + `("${DefaultFunction.name}", "${DefaultFunction.value}") `;
        }
      }
      sql = `INSERT INTO ${guildID}_config ${sqlVALUES} ON DUPLICATE KEY UPDATE config_name=VALUES(config_name), config_value=VALUES(config_value);`;
      await ExecuteQuery({ sql });
      resolve({});
    } else {
      sql = `INSERT INTO client_config (config_name, config_value) VALUES ("last_webhook_timestamp","0");`;
      await ExecuteQuery({ sql });
      resolve({});
    }
  });
}

module.exports = CreateGuildDB;
