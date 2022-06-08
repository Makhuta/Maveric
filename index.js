const { join } = require("path");

async function run() {
  //Load Global Files
  await require(join(__dirname, "src/boot/SetupGlobals.js")).run(__dirname);

  //Initialize Client
  await require(join(Boot, "botinit.js")).run();
  const { NSBR } = require(DClientLoc);

  //Init Database (MySQL)
  await require(join(Boot, "dbinit.js"));

  //Load/Register Source files
  await require(join(Boot, "loadfiles.js")).run("Event");
  await require(join(Boot, "loadfiles.js")).run("Command");
  await require(join(Boot, "loadfiles.js")).run("Font");

  //Register commands
  await require(join(Boot, "RegisterCommands.js"));

  console.info("Done!")
  NSBR.emit("ready")
}

//CommandList
//DClientLoc
/*
require(join(events, "botinit.js"));
require(join(events, "start.js"));
*/

run()