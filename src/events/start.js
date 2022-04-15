const fs = require("fs");
const { join } = require("path");
const { registerFont } = require("canvas");
const { client, NSBR } = require(DClientLoc);

function TableConvertor(name, state) {
  this.Name = name;
  this.State = state;
}

NSBR.on("botinit", async () => {
  fs.readdir(events, (err, files) => {
    if (err) console.log(err);

    let EventsTable = {};

    //console.info("\n--------------------------------------------------");
    let jsfile = files?.filter((f) => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
      console.log("There isn't any events to load!");
      return;
    }
    //console.log(`Loading ${jsfile.length} events...`);
    jsfile.forEach((f, i) => {
      let name = f.toLocaleString().split(".");
      EventsTable[i + 1] = new TableConvertor(name[0], "Loaded");
      //console.log(`${i + 1}: ${name[0]} loaded!`);
      if (name[0] == "botinit") return;
      require(join(events, f));
    });
    //console.info("--------------------------------------------------");
    console.table(EventsTable);
    NSBR.emit("EventsLoad", client);
  });
});

NSBR.on("EventsLoad", async () => {
  fs.readdir(fonts, (err, files) => {
    if (err) console.log(err);

    let FontsTable = {};

    //console.info("\n--------------------------------------------------");
    let tfffile = files?.filter((f) => f.split(".").pop() === "ttf");
    if (tfffile.length <= 0) {
      console.log("There isn't any fonts to load!");
      return;
    }
    //console.log(`Loading ${tfffile.length} fonts...`);
    tfffile.forEach((f, i) => {
      let name = f.toLocaleString().split(".");
      FontsTable[i + 1] = new TableConvertor(name[0], "Loaded");
      //console.log(`${i + 1}: ${name[0]} loaded!`);
      registerFont(join(fonts, f), { family: `${name[0]}` });
    });
    //console.info("--------------------------------------------------");
    console.table(FontsTable);
    NSBR.emit("FontsLoad", client);
  });
});

NSBR.on("ready", () => {
  console.info(`\n${client.user.tag} loaded succesfully.`)
})
