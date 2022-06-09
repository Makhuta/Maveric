const { client } = require(DClientLoc);
let { join } = require("path");
let GetGuildConfig = require(join(Functions, "GetGuildConfig.js"));

client.on("guildCreate", async (guild) => {
  let guildID = [guild.id];
  let LoadedGuildIDs = Object.keys(GuildsConfigs);
  await GetGuildConfig({
    guildIDs: guildID.concat(
      LoadedGuildIDs.filter((item) => guildID.indexOf(item) < 0)
    )
  });
});

client.on("guildDelete", async (guild) => {
  let guildID = [guild.id];
  let LoadedGuildIDs = Object.keys(GuildsConfigs);
  console.info({
    1: LoadedGuildIDs.slice(
      LoadedGuildIDs.indexOf(guildID) - 1,
      LoadedGuildIDs.indexOf(guildID)
    ),
    2: guildID,
    3: LoadedGuildIDs
  });
  await GetGuildConfig({
    guildIDs: LoadedGuildIDs.slice(
      LoadedGuildIDs.indexOf(guildID) - 1,
      LoadedGuildIDs.indexOf(guildID)
    )
  });
});
