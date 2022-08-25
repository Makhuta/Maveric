const { client } = require(DClientLoc);
const { join } = require("path");
const { isString } = require("util");
const JSONFilter = require(join(Functions, "global/JSONFilter.js"));

async function GuildHandler({ guild }) {
  //Check if Guild is specified
  let RegisteredCommands = [];
  if (guild) {
    await new Promise((resolve, reject) => {
      guild.commands.fetch().then(async (cmdslist) => {
        for (individualcmd of cmdslist) {
          RegisteredCommands.push(individualcmd[1].name);
        }
        resolve();
      });
    });
  } else {
    return console.error("Specify guild!");
  }

  //Filter guild commands from CommandList
  let ExistingCommands = Object.assign(
    {},
    JSONFilter({
      JSONObject: JSONFilter({ JSONObject: CommandList, SearchedElement: "Released", ElementValue: true }),
      SearchedElement: "SupportServerOnly",
      ElementValue: true
    }),
    JSONFilter({
      JSONObject: JSONFilter({ JSONObject: CommandList, SearchedElement: "Released", ElementValue: true }),
      SearchedElement: "IsOwnerDependent",
      ElementValue: true
    })
  );

  //Getting (not)registered commands as arrays
  let { NotRegisteredCommands, NotExistingCommands } = await FilterCommands({
    RegisteredCommands,
    ExistingCommands
  });

  console.info(
    `\nSupport server:\nRegistered commands: ${RegisteredCommands.join(", ")}\nNot registered commands: ${NotRegisteredCommands}\nExisting commands: ${Object.keys(
      ExistingCommands
    ).join(", ")}\nNot existing commands: ${NotExistingCommands}\n`
  );

  //Registering not registered commands
  for (NRCMD of NotRegisteredCommands) {
    await require(join(Functions, "command/Register.js"))({
      cmds: guild.commands,
      NRCMD: ExistingCommands[NRCMD]
    });
  }

  //Registering not existing commands
  for (NECMD of NotExistingCommands) {
    await require(join(Functions, "command/Remove.js"))({
      cmds: guild.commands,
      NECMD
    });
  }
}

async function GlobalHandler() {
  //Check if Guild is specified
  let RegisteredCommands = [];

  await new Promise((resolve, reject) => {
    client.application?.commands.fetch().then(async (cmdslist) => {
      for (individualcmd of cmdslist) {
        RegisteredCommands.push(individualcmd[1].name);
      }
      resolve();
    });
  });

  //Filter guild commands from CommandList
  let ExistingCommands = JSONFilter({
    JSONObject: JSONFilter({
      JSONObject: JSONFilter({
        JSONObject: JSONFilter({ JSONObject: CommandList, SearchedElement: "Released", ElementValue: true }),
        SearchedElement: "Released",
        ElementValue: true
      }),
      SearchedElement: "SupportServerOnly",
      ElementValue: false
    }),
    SearchedElement: "IsOwnerDependent",
    ElementValue: false
  });

  //Getting (not)registered commands as arrays
  let { NotRegisteredCommands, NotExistingCommands } = await FilterCommands({
    RegisteredCommands,
    ExistingCommands
  });

  console.info(
    `\nGlobal:\nRegistered commands: ${RegisteredCommands.join(", ")}\nNot registered commands: ${NotRegisteredCommands}\nExisting commands: ${Object.keys(
      ExistingCommands
    ).join(", ")}\nNot existing commands: ${NotExistingCommands}\n`
  );

  //Registering not registered commands
  for (NRCMD of NotRegisteredCommands) {
    await require(join(Functions, "command/Register.js"))({
      cmds: client.application?.commands,
      NRCMD: ExistingCommands[NRCMD]
    });
  }

  //Registering not existing commands
  for (NECMD of NotExistingCommands) {
    await require(join(Functions, "command/Remove.js"))({
      cmds: client.application?.commands,
      NECMD
    });
  }
}

async function FilterCommands({ RegisteredCommands, ExistingCommands }) {
  let ExistingCommandsKeys = Object.keys(ExistingCommands);
  let NotRegisteredCommands = ExistingCommandsKeys.filter((ECMD) => !RegisteredCommands.includes(ECMD));
  let NotExistingCommands = RegisteredCommands.filter((RCMD) => !ExistingCommandsKeys.includes(RCMD));

  return { NotRegisteredCommands, NotExistingCommands };
}

module.exports = {
  guild: GuildHandler,
  global: GlobalHandler
};
