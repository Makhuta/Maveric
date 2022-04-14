const fs = require("fs");
const { join } = require("path");
const { client } = require(DClientLoc);

var cmdsnameslistbot = [];

function loadcommands() {
  return new Promise((resolve, reject) => {
    fs.readdir(commands, (err, files) => {
      let CommandsArray = {};
      if (err) console.log(err);

      console.info("\n--------------------------------------------------");
      let jsfile = files?.filter((f) => f.split(".").pop() === "js");
      if (jsfile.length <= 0) {
        console.log("There isn't any commands to load!");
        return;
      }

      console.log(`Loading ${jsfile.length} commands...`);
      let i = 0;
      for (f of jsfile) {
        let name = f.toLocaleString().split(".");
        let cmd = require(join(commands, f));
        let CommandInfo = {
          name: cmd.name ? cmd.name : "NONAME",
          description: cmd.description
            ? cmd.description
            : "Command has no description.",
          filename: f,
          code: cmd.run
        };
        CommandsArray[CommandInfo.name.toLowerCase()] = CommandInfo;
        cmdsnameslistbot.push(
          JSON.stringify({
            name: CommandInfo.name.toLowerCase(),
            description: CommandInfo.description
          })
        );
        //console.info(cmd);
        console.log(`${i + 1}: ${name[0]} loaded!`);
        i++;
      }
      //console.info(CommandsArray)
      console.info("--------------------------------------------------");
      console.info("\n");
      resolve(CommandsArray);
    });
  });
}

async function RegisterCommand({ guild, CommandList }) {
  let cmds;
  if (guild) {
    cmds = guild.commands;
  } else {
    cmds = client.application?.commands;
  }

  await cmds.fetch().then(async (cmdslist) => {
    let cmdsnameslistdiscord = [];

    for (individualcmd of cmdslist) {
      let check = JSON.stringify({
        name: individualcmd[1].name,
        description: individualcmd[1].description
      });
      cmdsnameslistdiscord.push(
        JSON.stringify({
          name: individualcmd[1].name,
          description: individualcmd[1].description
        })
      );

      if (!cmdsnameslistbot.includes(check)) {
        console.info(`${individualcmd[1].name} is not my command. Removing...`);
        cmds?.delete(individualcmd[0]);
        continue;
      }
    }

    //console.info(cmdsnameslistdiscord);
    for (CommandKey in CommandList) {
      let c = CommandList[CommandKey];
      let check = JSON.stringify({
        name: c.name.toLowerCase(),
        description: c.description
      });
      //console.info(c);
      if (c.name == "NONAME") {
        console.info(`${c.filename} has no name.`);
        continue;
      }

      if (cmdsnameslistdiscord.includes(check)) {
        console.info(`Command "${c.name}" is already registered.`);
        continue;
      }
      require(join(commands, c.filename)).create({ commands: cmds });
      console.info(`Command "${c.name}" has been registered succesfully.`);
    }
  });
}

client.on("NSBRFontsLoad", async () => {
  global.CommandList = await loadcommands();
  let guilds = client.guilds.cache;

  for (guild of guilds) {
    guild = guild[1];
    console.info("\n--------------------------------------------------");
    console.info(`Loading for ${guild.name} started.`);
    await RegisterCommand({ guild, CommandList });
    console.info("--------------------------------------------------");
  }
});
