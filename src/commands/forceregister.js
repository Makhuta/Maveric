const { client } = require(DClientLoc);
let { join } = require("path");
let RemoveCommand = require(join(Functions, "RemoveCommand.js"));
let RegisterCommand = require(join(Functions, "RegisterCommand.js"));

module.exports = {
  name: "ForceRegister",
  description: "This is the test command.",
  default: "BotOwner",
  helpdescription: "This is the test command.",
  usage: "!forceregister",
  helpname: "ForceRegister",
  type: "Testing",
  async run(message, args) {
    let cmds = client.application?.commands;
    let requrestedcmd = CommandList.find((c) => c.Name == args[0]);
    let requrestedcmdexist = requrestedcmd != undefined;

    if (!requrestedcmdexist) {
      return message.reply({ content: `${args[0]} not exist!` });
    }
    if (requrestedcmd.Type == "Testing" || requrestedcmd.Type == "Disabled") {
      return message.reply({
        content: `Registering for ${args[0]} was disabled!`
      });
    }
    await RemoveCommand({
      cmds,
      NECMD: requrestedcmd.FileName
    });
    await RegisterCommand({
      cmds,
      NRCMD: { FileName: requrestedcmd.FileName }
    });
    message.reply({
      content: `${args[0]} has been force registered!`
    });
  }
};
