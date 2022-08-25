const { client } = require(DClientLoc);
let { join } = require("path");
let GetGuildConfig = require(join(Functions, "guild/GetGuildConfig.js"));

client.on("guildCreate", async (guild) => {
  let guildID = [guild.id];
  let LoadedGuildIDs = Object.keys(GuildsConfigs);
  await GetGuildConfig({
    guildIDs: guildID.concat(
      LoadedGuildIDs.filter((item) => {
        if (item != guildID) return true;
        else return false;
      })
    )
  });
});

client.on("guildDelete", async (guild) => {
  let guildID = [guild.id];
  let LoadedGuildIDs = Object.keys(GuildsConfigs);
  let guildIDs = LoadedGuildIDs.filter((item) => {
    if (item != guildID) return true;
    else return false;
  });
  await GetGuildConfig({
    guildIDs
  });
});
