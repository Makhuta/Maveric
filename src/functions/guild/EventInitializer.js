const { join } = require("path");
const PermissionsList = require(join(Configs, "PermissionsList.json"));
const UpdateVariable = require(join(Functions, "database/UpdateVariable.js"));

module.exports = async function (RequestedInits, interaction) {
  let guild = interaction.member.guild;
  let SuccesfullOperation = [];
  let RequestedInitsKeys = Object.keys(RequestedInits);
  let ControlledChannelList = {};

  for (RequestedInitKey of RequestedInitsKeys) {
    let RequestedInit = RequestedInits[RequestedInitKey];
    let PermissionsInChannel = guild.members.me.permissionsIn(RequestedInit.Channel);
    let ArrayOfOwnedPerms = [];
    for (RequestedInitPerm of RequestedInit.Permissions) {
      ArrayOfOwnedPerms.push(PermissionsInChannel.has(PermissionsList[RequestedInitPerm]));
    }
    if (ArrayOfOwnedPerms.some((e) => !e)) continue;
    let CorrespondingVariable = RequestedInit.CorrespondingVariables[RequestedInitKey];
    ControlledChannelList[RequestedInitKey] = { ID: RequestedInit.Channel.id, CorrespondingVariable: CorrespondingVariable };
    SuccesfullOperation.push((RequestedInitKey.slice(0, 1) + RequestedInitKey.slice(1, RequestedInitKey.length).toLowerCase()).replace("_", " "));
    GuildsConfigs[guild.id].config[`${RequestedInitKey}_ENABLED`] = true;
    GuildsConfigs[guild.id].config[CorrespondingVariable] = RequestedInit.Channel.id;
    await UpdateVariable({
      guildID: guild.id,
      variable: CorrespondingVariable,
      value: RequestedInit.Channel.id
    });
  }

  return SuccesfullOperation.length < 1 ? ["None"] : SuccesfullOperation;
};
