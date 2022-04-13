const fs = require("fs");
const { join } = require("path");
const { registerFont } = require("canvas");

function loadcommands() {
  console.log(commands + "\n\n\n\n\n\n\n\n")
  fs.readdir(commands, (err, files) => {
    if (err) console.log(err);

    let jsfile = files?.filter((f) => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
      console.log("There isn't any commands to load!");
      return;
    }
    console.log(`Loading ${jsfile.length} commands...`);
    jsfile.forEach((f, i) => {
      let name = f.toLocaleString().split(".");
      console.log(`${i + 1}: ${name[0]} loaded!`);
    });
  });
}

function loadevents() {
  fs.readdir(events, (err, files) => {
    if (err) console.log(err);

    let jsfile = files?.filter((f) => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
      console.log("There isn't any events to load!");
      return;
    }
    console.log(`Loading ${jsfile.length} events...`);
    jsfile.forEach((f, i) => {
      let name = f.toLocaleString().split(".");
      console.log(`${i + 1}: ${name[0]} loaded!`);
      require(join(events, f));
    });
  });
}

function loadfonts() {
  fs.readdir(fonts, (err, files) => {
    if (err) console.log(err);

    let tfffile = files?.filter((f) => f.split(".").pop() === "ttf");
    if (tfffile.length <= 0) {
      console.log("There isn't any fonts to load!");
      return;
    }
    console.log(`Loading ${tfffile.length} fonts...`);
    tfffile.forEach((f, i) => {
      let name = f.toLocaleString().split(".");
      console.log(`${i + 1}: ${name[0]} loaded!`);
      registerFont(join(fonts, f), { family: `${name[0]}` });
    });
  });
}

module.exports = {
  run() {
    loadcommands();
    loadevents();
    loadfonts();
  }
};
