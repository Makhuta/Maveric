const { client } = require(DClientLoc);
let { join } = require("path");
let GetGuildConfig = require(join(Functions, "GetGuildConfig.js"));
let DefaultFunctionsStates = require(join(Configs, "DefaultFunctionsStates.json"));
let DefaultVariables = require(join(Configs, "DefaultVariables.json"));
let ConfigDBManager = require(join(Functions, "ConfigDBManager.js"));

async function GettingExistingConfigs() {
  let ExistingConfigs = {};
  for (DFState of DefaultFunctionsStates) {
    ExistingConfigs[DFState.name] = DFState.value;
  }

  for (DV of DefaultVariables) {
    ExistingConfigs[DV.name] = DV.value;
  }

  return ExistingConfigs;
}

async function LoadGuildsConfigs() {
  let ExistingConfigs = await GettingExistingConfigs();

  let guildIDs = [];
  await client.guilds
    .fetch()
    .then(async (guilds) => {
      for (guild of guilds) {
        let guildID = guild[0];
        guildIDs.push(guildID);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  await GetGuildConfig({ guildIDs });

  await ConfigDBManager({ type: "DELETE", guildIDs, ExistingConfigs });
  console.info();
  await ConfigDBManager({ type: "INSERT", guildIDs, ExistingConfigs });
  console.info();
  console.info();
}

module.exports = LoadGuildsConfigs;
