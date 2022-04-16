const fs = require("fs");
const { join } = require("path");
const { client, NSBR } = require(DClientLoc);

var cmdsnameslistbot = [];

function TableConvertor(name, state) {
  this.Name = name;
  this.State = state;
}

function loadcommands() {
  return new Promise((resolve, reject) => {
    fs.readdir(commands, (err, files) => {
      let CommandsArray = {};
      if (err) console.log(err);

      let CommandsTable = {};

      //console.info("\n--------------------------------------------------");
      let jsfile = files?.filter((f) => f.split(".").pop() === "js");
      if (jsfile.length <= 0) {
        console.log("There isn't any commands to load!");
        return;
      }

      //console.log(`Loading ${jsfile.length} commands...`);
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
        CommandsTable[i + 1] = new TableConvertor(name[0], "Loaded");
        //console.log(`${i + 1}: ${name[0]} loaded!`);
        i++;
      }
      console.table(CommandsTable);
      //console.info(CommandsArray)
      //console.info("--------------------------------------------------");
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

  await cmds
    .fetch()
    .then(async (cmdslist) => {
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
          console.info(
            `${individualcmd[1].name} is not my command. Removing...`
          );
          cmds?.delete(individualcmd[0]);
          continue;
        }
        //console.info(individualcmd[1]);
      }
      let RegisterTable = {};
      let i = 0;
      //console.info(cmdsnameslistdiscord);
      for (CommandKey in CommandList) {
        i++;
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
        let registeredCMD;

        await guild.roles
          .fetch()
          .then(async (roles) => {
            let commandPermissions = [];
            let { allowedRoles } = require(join(commands, c.filename));
            if (allowedRoles == undefined) allowedRoles = ["Member"];
            if (!allowedRoles.includes("@everyone"))
              allowedRoles.push("@everyone");
            for (allowedRole of allowedRoles) {
              let RoleFound = false;
              for (role of roles) {
                if (role[1].name != allowedRole) continue;
                if (allowedRole != "@everyone") {
                  commandPermissions.push({
                    id: role[0],
                    type: "ROLE",
                    permission: true
                  });
                } else {
                  commandPermissions.push({
                    id: role[0],
                    type: "ROLE",
                    permission: false
                  });
                }
                RoleFound = true;
              }

              if (RoleFound) continue;
              console.info(`Role ${allowedRole} was not found. Creating...`);
              let allowedRoleCreate = await guild.roles.create({
                name: allowedRole
              });
              commandPermissions.push({
                id: allowedRoleCreate.id,
                type: "ROLE",
                permission: true
              });
            }

            if (cmdsnameslistdiscord.includes(check)) {
              RegisterTable[i] = new TableConvertor(
                c.name,
                "Already registered"
              );
              //console.info(`Command "${c.name}" is already registered.`);
              registeredCMD = cmdslist
                .filter((c) => c.name == JSON.parse(check).name)
                .first();
            } else {
              registeredCMD = await require(join(commands, c.filename)).create({
                commands: cmds
              });
            }
            //console.info(registeredCMD);

            //if (guild == undefined) return console.info("Register canceled.");

            //console.log(guild)
            await registeredCMD.permissions
              .add({
                permissions: commandPermissions
              })
              .catch((error) => console.error(error));

            //registeredCMD.permissions.add({commandPermissions})
            //console.info(commandPermissions);
          })
          .catch((error) => console.error(error));
        RegisterTable[i] = new TableConvertor(c.name, "Registered");
        //console.info(`Command "${c.name}" has been registered succesfully.`);
      }
      console.table(RegisterTable);
    })
    .catch((error) => console.error(error));
}

NSBR.on("FontsLoad", async () => {
  global.CommandList = await loadcommands();
  let guilds = client.guilds.cache;

  for (guild of guilds) {
    guild = guild[1];
    console.info("\n");
    console.info(`Loading for ${guild.name} started.`);
    await RegisterCommand({ guild, CommandList });
    //console.info("--------------------------------------------------");
  }
  NSBR.emit("ready");
});

client.on("guildCreate", async (guild) => {
  console.info(
    `\n\n${client.user.tag} joined ${guild.name}. Registering commands...`
  );
  await RegisterCommand({ guild, CommandList });
});
