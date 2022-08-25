let { join } = require("path");
let ExecuteQuery = require(join(Functions, "database/Executer.js"));

async function UpdateVariable({ guildID, variable, value }) {
  let sql = `INSERT INTO ${guildID}_config (config_name, config_value) VALUES ("${variable}", "${value}") ON DUPLICATE KEY UPDATE config_name=VALUES(config_name),config_value=VALUES(config_value);`;
  let Response = await ExecuteQuery({ sql });
  GuildsConfigs[guildID].config[variable] = value;

  return Response;
}

module.exports = UpdateVariable;