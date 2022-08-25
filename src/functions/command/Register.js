const { join } = require("path");
require("dotenv").config();

async function RegisterCMD({ cmds, NRCMD }) {
  await require(NRCMD.Path).create({
    commands: cmds,
    permissions: (function () {
      if (NRCMD.IsOwnerDependent || NRCMD.IsAdminDependent) {
        if (NRCMD.RequiedUserPermissions.length < 1) return "0";
        else return require(join(Configs, "PermissionsList.json"))[NRCMD.RequiedUserPermissions];
      }
    })(),
    dmEnabled: NRCMD.PMEnable
  });
}

module.exports = RegisterCMD;
