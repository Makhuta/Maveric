const { client } = require(DClientLoc);
const { join } = require("path");
const { isString } = require("util");

async function GetRegisteredCMDS(cmds) {
  //Getting commands that bot has registered
  let RegisteredCMDS = [];
  await cmds
    .fetch()
    .then(async (cmdslist) => {
      for (individualcmd of cmdslist) {
        RegisteredCMDS.push(
          JSON.stringify({
            name: individualcmd[1].name,
            description: individualcmd[1].description
          })
        );
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return RegisteredCMDS;
}

async function GuildHandler(data) {
  let guild = data?.guild;

  //Check if Guild is specified
  if (guild) {
    cmds = guild.commands;
  } else {
    return console.error("Specify guild!");
  }

  //Filter guild commands from CommandList
  let FilteredGuildCommands = CommandList.filter((cmd) => cmd.Type === "Guild").filter((cmd) => !isString(cmd.Permissions));

  //Getting (not)registered commands as arrays
  let { NotRegisteredCommands, RegisteredCommands } = await FilterRegisteredCommands({
    cmds,
    FilteredCommands: FilteredGuildCommands
  });

  //Registering not registered commands
  for (NRCMD of NotRegisteredCommands) {
    await require(join(Functions, "RegisterCommand.js"))({
      cmds,
      NRCMD,
      guild
    });
  }

  //Getting (not)existing commands as arrays
  let { NotExistingCommands, ExistingCommands } = await FilterNotExistingCommands({
    cmds,
    FilteredCommands: FilteredGuildCommands
  });

  //Registering not existing commands
  for (NECMD of NotExistingCommands) {
    await require(join(Functions, "RemoveCommand.js"))({
      cmds,
      NECMD
    });
  }
}

async function GlobalHandler() {
  let cmds = client.application?.commands;
  //Filter guild commands from CommandList
  let FilteredGuildCommands = CommandList.filter((cmd) => cmd.Type === "Global");

  //Getting (not)registered commands as arrays
  let { NotRegisteredCommands, RegisteredCommands } = await FilterRegisteredCommands({
    cmds,
    FilteredCommands: FilteredGuildCommands
  });


  //Registering not registered commands
  for (NRCMD of NotRegisteredCommands) {
    await require(join(Functions, "RegisterCommand.js"))({
      cmds,
      NRCMD
    });
  }

  //Getting (not)existing commands as arrays
  let { NotExistingCommands, ExistingCommands } = await FilterNotExistingCommands({
    cmds,
    FilteredCommands: FilteredGuildCommands
  });

  //Registering not existing commands
  for (NECMD of NotExistingCommands) {
    await require(join(Functions, "RemoveCommand.js"))({
      cmds,
      NECMD
    });
  }
}

async function FilterRegisteredCommands({ cmds, FilteredCommands }) {
  let NotRegisteredCommands = [];
  let RegisteredCommands = [];

  let RegisteredCMDS = await GetRegisteredCMDS(cmds);

  for (fCMD of FilteredCommands) {
    let check = fCMD.Check;

    if (RegisteredCMDS.includes(check)) {
      RegisteredCommands.push(fCMD);
      console.info(`${fCMD.Name} is registered`);
    } else {
      NotRegisteredCommands.push(fCMD);
      console.info(`${fCMD.Name} is not registered`);
    }
  }

  return { NotRegisteredCommands, RegisteredCommands };
}

async function FilterNotExistingCommands({ cmds, FilteredCommands }) {
  let NotExistingCommands = [];
  let ExistingCommands = [];
  let FilteredCommandsChecks = [];

  let ExistingCMDS = await GetRegisteredCMDS(cmds);

  for (fCMD of FilteredCommands) {
    FilteredCommandsChecks.push(fCMD.Check);
  }

  for (eCMD of ExistingCMDS) {
    if (FilteredCommandsChecks.includes(eCMD)) {
      ExistingCommands.push(FilteredCommands[FilteredCommandsChecks.indexOf(eCMD)]);
      console.info(`${JSON.parse(eCMD).name} exist`);
    } else {
      NotExistingCommands.push(JSON.parse(eCMD).name);
      console.info(`${JSON.parse(eCMD).name} not exist`);
    }
  }

  return { NotExistingCommands, ExistingCommands };
}

module.exports = {
  guild: GuildHandler,
  global: GlobalHandler
};
