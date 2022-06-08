const { join } = require("path");
const { isArray, isString, isUndefined } = require("util");
const { client, NSBR } = require(DClientLoc);
require("dotenv").config();

var isGlobal;
var commandPermissions = [];

async function SetCommandPermissions({ Permissions, guild }) {
  if (isArray(Permissions)) {
    for (permission of Permissions) {
      let GuildRole = await require(join(Functions, "GetGuildRole.js"))({
        guild,
        permission
      });
      commandPermissions.push({
        id: GuildRole.id,
        type: "ROLE",
        permission: true
      });
    }
  }
}

async function RegisterCMD({ cmds, NRCMD, guild }) {

  let { Permissions } = NRCMD;

  if (Permissions.length == 0) isGlobal = true;

  if (!isGlobal && !isUndefined(guild)) {
    await SetCommandPermissions({ Permissions, guild });
  }

  let RegisteredCMD = await require(join(Commands, NRCMD.FileName)).create({
    commands: cmds
  });

  if (!isGlobal) {
    RegisteredCMD.permissions
      .add({
        permissions: commandPermissions
      })
      .catch((error) => console.error(error));
  }
}

module.exports = RegisterCMD;
