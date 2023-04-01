require("dotenv").config();

function get_permissions(NRCMD) {
  let buff = [];
  for(required_permissions of NRCMD.RequiedUserPermissions) {
    buff.push(PossiblePermissions[required_permissions]);
  }
  return buff;
}

async function RegisterCMD({ cmds, NRCMD }) {
  await require(NRCMD.Path).create({
    commands: cmds,
    permissions: (function () {
      if (NRCMD.IsOwnerDependent || NRCMD.IsAdminDependent) {
        if (NRCMD.RequiedUserPermissions.length < 1) return "0";
        else return get_permissions(NRCMD);
      }
    })(),
    dmEnabled: NRCMD.PMEnable
  });
}

module.exports = RegisterCMD;
