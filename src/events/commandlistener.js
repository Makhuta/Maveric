const { client } = require(DClientLoc);

function GetCommandsNames() {
  let CMDList = [];
  for (cmdID in CommandList) {
    let cmd = CommandList[cmdID];
    CMDList.push(cmd.Name);
  }
  return CMDList;
}

function GetPrivateCommandsNames() {
  let CMDList = [];
  for (cmdID in CommandList) {
    let cmd = CommandList[cmdID];
    if (cmd.Type == "Testing" || cmd.Type == "Private") {
      CMDList.push(cmd.Name);
    }
  }
  return CMDList;
}

async function RunOwnerCommand({ prefix, command, args, message }) {
  if (prefix != "!") return;

  let CMDNamesList = GetPrivateCommandsNames();
  if (!CMDNamesList.includes(command)) return;

  let RequestedCommand = CommandList.find((CMD) => CMD.Name == command);

  require(RequestedCommand.Location).run(message, args);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;
  let CMDNamesList = GetCommandsNames();
  //console.info(interaction);

  if (!CMDNamesList.some((CMDName) => CMDName == commandName)) {
    interaction
      .reply({
        content: "I don´t know how to response to this."
      })
      .catch((error) => console.error(error));

    return console.info(`"${commandName}" is not my command. Universal reply.`);
  }

  let RequestedCommand = CommandList.find((CMD) => CMD.Name == commandName);

  if (
    interaction.guildId == null &&
    !(await require(RequestedCommand.Location).PMEnable)
  ) {
    return interaction.reply({
      content: `You need to send this to server to use ${interaction.commandName}`
    });
  }

  await require(RequestedCommand.Location).run(interaction);
});

client.on("messageCreate", async (message) => {
  let prefix = message.content.slice(0, 1);
  let messagecontent = message.content.slice(1).split(" ");
  let command = messagecontent.shift();
  RunOwnerCommand({ prefix, command, args: messagecontent, message });
});
