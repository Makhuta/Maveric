const { join } = require("path");

const { client, NSBR } = require(DClientLoc);

async function RemoveCMD({ cmds, NECMD, permissions, guild }) {
  await cmds.fetch().then(async (cmdslist) => {
    for (individualcmd of cmdslist) {
      if (individualcmd[1].name === NECMD) {
        cmds?.delete(individualcmd[0]);
      }
    }
  });

  /*await require(join(Commands, NRCMD.FileName)).create({
    commands: guild.commands,
    permissions: commandPermissions
  });*/
}

module.exports = RemoveCMD;
