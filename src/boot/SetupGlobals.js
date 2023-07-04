const { join } = require("path");
const { ApplicationCommandOptionType, ChannelType, PermissionsBitField } = require("discord.js");

require("dotenv").config();


module.exports = {
    run(DIR) {
        return new Promise((resolve, reject) => {
            //Folders
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

            //Discord.js thinks
            global.CommandTypes = ApplicationCommandOptionType;
            global.ChannelTypes = ChannelType;
            global.PossiblePermissions = PermissionsBitField.Flags;

            //Maveric thinks
            global.CommandList = {};
            global.GuildsConfigs = {};

            console.info("Globals Loaded!");
            resolve();
        })
    }
}