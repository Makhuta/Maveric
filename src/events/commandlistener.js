const { client } = require(DClientLoc);
require("dotenv").config();

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
  let isDM;

  let where;

  if (message.guildId == null) {
    where = "through DM";
    isDM = true;
  } else {
    where = `from Guild: ${message.guildId}`;
    isDM = false;
  }

  if (message.author.id != process.env.OWNER_ID)
    return console.info(
      `${message.author.username}#${message.author.id} tried to use: ${command} ${where}`
    );

  let CMDNamesList = GetPrivateCommandsNames();
  if (!CMDNamesList.includes(command)) return;

  let RequestedCommand = CommandList.find((CMD) => CMD.Name == command);

  if (!require(RequestedCommand.Location).PMEnable && isDM) {
    return console.info(`${command} has disabled DM usage.`);
  }

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
