const { join } = require("path");

async function run() {
  //Load Global Files
  await require(join(__dirname, "src/boot/SetupGlobals.js")).run(__dirname);

  //Initialize Client
  await require(join(Boot, "botinit.js")).run();

  //Init Database (MySQL)
  await require(join(Boot, "dbinit.js"));

  //Load/Register Source files
  await require(join(Boot, "loadfiles.js")).run("Event");
  await require(join(Boot, "loadfiles.js")).run("Command");
  await require(join(Boot, "loadfiles.js")).run("Font");

  //Register commands
  await require(join(Boot, "RegisterCommands.js"));

  console.info("Done!");

  //Emmitting that bot is done loading
  const { NSBR } = require(DClientLoc);
  NSBR.emit("ready");
}

run();
