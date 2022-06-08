let { join } = require("path");
let ExecuteQuery = require(join(Functions, "DBExecuter.js"));

module.exports = async ({ guildID }) => {
  let sql = `SELECT * FROM ${guildID}_config`;
  let GuildConfig = await ExecuteQuery({ sql });

  let configs = {};
  for (let c of GuildConfig) {
    configs[c.config_name] = c.config_value;
  }

  return configs;
};
