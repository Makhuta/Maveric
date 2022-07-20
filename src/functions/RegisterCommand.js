const { join } = require("path");
require("dotenv").config();

async function RegisterCMD({ cmds, NRCMD }) {
  await require(join(Commands, NRCMD.FileName)).create({
    commands: cmds,
    permissions: NRCMD.default
  });
}

module.exports = RegisterCMD;
