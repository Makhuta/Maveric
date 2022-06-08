let { join } = require("path");
let ExecuteQuery = require(join(Functions, "DBExecuter.js"));

async function UpdateVariable({ guildID, variable, value }) {
  let sql = `INSERT INTO ${guildID}_config (config_name, config_value) VALUES ("${variable}", "${value}") ON DUPLICATE KEY UPDATE config_name=VALUES(config_name),config_value=VALUES(config_value);`;
  let Response = await ExecuteQuery({ sql });

  return Response;
}

module.exports = UpdateVariable;
