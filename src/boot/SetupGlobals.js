const { join } = require("path");
const { ApplicationCommandOptionType } = require("discord.js");
const Topgg = require("@top-gg/sdk");
require("dotenv").config();

module.exports = {
  run(DIR) {
    //Promise that will resolve when all globals are set
    const promise = new Promise((resolve, reject) => {
      global.ROOT = DIR;
      global.SRC = join(ROOT, "src");
      global.Boot = join(SRC, "boot");
      global.Commands = join(SRC, "commands");
      global.Events = join(SRC, "events");
      global.Canvases = join(SRC, "canvases");
      global.Pictures = join(SRC, "pictures");
      global.ColorPaletes = join(SRC, "colorpaletes");
      global.Fonts = join(SRC, "fonts");
      global.Configs = join(SRC, "configs");
      global.Functions = join(SRC, "functions");
      global.CommandTypes = ApplicationCommandOptionType;
      global.CommandList = {};
      global.GuildsConfigs = {};
      global.TopGGApi = new Topgg.Api(process.env.TOPGGTOKEN);
      global.PossiblePermissions = require(join(Configs, "PermissionsList.json"));

      console.info("Globals Loaded!");
      resolve();
    });
    return promise;
  }
};
