const fs = require("fs");
const { join } = require("path");
const { registerFont } = require("canvas");
const { NSBR } = require(DClientLoc);

function TableConvertor({ FileLocation, f }) {
  var FilePath = join(FileLocation, f);
  var file = require(FilePath);
  this.Name = f.split(".").shift();
  this.Location = FilePath;
  (this.Type = file?.type ? file?.type : "Disabled"),
    (this.Check = JSON.stringify({
      name: this.Name,
      description: file.description
    }));
  this.FileName = f;
  this.Permissions = file.allowedRoles ? file.allowedRoles : [];
}

const CommandPromise = new Promise((resolve, reject) => {
  var FileLocation = Commands;
  fs.readdir(FileLocation, (err, files) => {
    if (err) console.error(err);
    let jsfiles = files?.filter((f) => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
      console.info("There isn't any commands to load!");
      resolve();
      return;
    }
    jsfiles.forEach((f, i) => {
      CommandList.push(new TableConvertor({ FileLocation, f }));
    });
    console.info("Commands loaded!");
    NSBR.emit("CommandLoad");
    resolve();
  });
});

const EventPromise = new Promise((resolve, reject) => {
  var FileLocation = Events;
  fs.readdir(FileLocation, (err, files) => {
    if (err) console.error(err);
    let jsfiles = files?.filter((f) => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
      console.info("There isn't any events to load!");
      resolve();
      return;
    }
    jsfiles.forEach((f, i) => {
      require(join(FileLocation, f));
    });
    console.info("Events Loaded!");
    NSBR.emit("EventLoad");
    resolve();
  });
});

const FontPromise = new Promise((resolve, reject) => {
  var FileLocation = Fonts;
  fs.readdir(FileLocation, (err, files) => {
    if (err) console.error(err);
    let tfffiles = files?.filter((f) => f.split(".").pop() === "ttf");
    if (tfffiles.length <= 0) {
      console.info("There isn't any fonts to load!");
      resolve();
      return;
    }
    tfffiles.forEach((f, i) => {
      let name = f.toLocaleString().split(".").shift();
      registerFont(join(Fonts, f), { family: `${name}` });
    });
    console.info("Fonts registered!");
    NSBR.emit("FontLoad");
    resolve();
  });
});

module.exports = {
  async run(type) {
    switch (type) {
      case "Command":
        return await CommandPromise;
        break;
      case "Event":
        return await EventPromise;
        break;
      case "Font":
        return await FontPromise;
        break;
      default:
        console.error("Type is not defined or was defined wrong.");
        break;
    }
  }
};
