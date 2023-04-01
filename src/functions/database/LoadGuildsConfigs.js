const { client } = require(DClientLoc);
let { join } = require("path");
let DefaultFunctionsStates = require(join(Configs, "DefaultFunctionsStates.json"));
let DefaultVariables = require(join(Configs, "DefaultVariables.json"));
let GetGuildConfig = require(join(Functions, "guild/GetGuildConfig.js"));
let ConfigManager = require(join(Functions, "database/ConfigManager.js"));

async function GettingExistingConfigs() {
    let ExistingConfigs = {};
    for (DFState of DefaultFunctionsStates) {
      ExistingConfigs[DFState.name] = DFState.value;
      if (DFState.possibleInit?.length > 0 || false) {
        for (DFStateEnabled of DFState.possibleInit) {
          ExistingConfigs[`${DFStateEnabled}_ENABLED`] = true;
        }
      }
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
    //console.info(GuildsConfigs);
    
    await ConfigManager({ type: "DELETE", guildIDs, ExistingConfigs });
    console.info();
    await ConfigManager({ type: "INSERT", guildIDs, ExistingConfigs });
    console.info();
    console.info();
  }
  
  module.exports = LoadGuildsConfigs;
  