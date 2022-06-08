const { client } = require(DClientLoc);
let { join } = require("path");
let GetGuildConfig = require(join(Functions, "GetGuildConfig.js"));

async function LoadGuildsConfigs() {
  await client.guilds.fetch().then(async (guilds) => {
    for (guild of guilds) {
      let guildID = guild[0];
      let configsJSON = await GetGuildConfig({ guildID });
      GuildsConfigs[guildID] = { config: configsJSON };
    }
  });
}

module.exports = LoadGuildsConfigs;
