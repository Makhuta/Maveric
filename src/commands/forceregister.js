const { client } = require(DClientLoc);
let { join } = require("path");
let RemoveCommand = require(join(Functions, "command/Remove.js"));
let RegisterCommand = require(join(Functions, "command/Register.js"));
const JSONFilter = require(join(Functions, "global/JSONFilter.js"));

module.exports = {
  Name: "ForceRegister",
  DescriptionShort: "This is the force register command.",
  DescriptionLong: "This is the force register command.",
  Usage: "/forceregister [command]",
  Category: "Moderation",
  IsOwnerDependent: true,
  Released: true,
  RequiedUserPermissions: ["Administrator"],
  RequiedBotPermissions: ["SendMessages", "ViewChannel"],
  async create({ commands, permissions, dmEnabled }) {
    let choices = [];
    let CommandListFiltered = Object.keys(JSONFilter({ JSONObject: CommandList, SearchedElement: "Released", ElementValue: true }));
    for (IndividualCommand of CommandListFiltered) {
      choices.push({
        name: CommandList[IndividualCommand].Name,
        value: CommandList[IndividualCommand].Name
      });
    }
    let options = [
      {
        name: "command",
        description: "Name of command you want to force register",
        required: true,
        type: CommandTypes.String,
        choices: choices
      }
    ];
    let command = await commands?.create({
      name: this.Name.toLowerCase(),
      description: this.DescriptionShort,
      dmPermission: dmEnabled,
      defaultMemberPermissions: permissions,
      options
    });
    return command;
  },
  async run(interaction) {
    await interaction.deferReply();
    const { options } = interaction;
    let RequestedCommandName = options.getString("command");
    let ccmds = client.application?.commands;
    let gcmds = interaction.guild.commands;
    let cmds;
    let requrestedcmd = JSONFilter({ JSONObject: CommandList, SearchedElement: "Name", ElementValue: RequestedCommandName })[RequestedCommandName.toLowerCase()];

    let requrestedcmdexist = requrestedcmd != undefined;
    if (!requrestedcmdexist) {
      return message.reply({ content: `${RequestedCommandName} not exist!` });
    }

    if (requrestedcmd.SupportServerOnly) cmds = gcmds;
    else cmds = ccmds;

    await RemoveCommand({
      cmds,
      NECMD: requrestedcmd.Name.toLowerCase()
    });
    await RegisterCommand({
      cmds,
      NRCMD: requrestedcmd
    });
    interaction.editReply({
      content: `${RequestedCommandName} has been force registered!`
    });
  }
};
