const fs = require("fs");
const { join } = require("path");
const { registerFont } = require("canvas");
const { NSBR } = require(DClientLoc);

//Loading commands from folder
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
      let FilePath = join(FileLocation, f);
      let RequestedCommand = require(FilePath);
      let CommandName = RequestedCommand.Name || `${f.split(".").shift().slice(0, 1).toUpperCase()}${f.split(".").shift().slice(1)}`;
      let CommandStructured = {
        Name: CommandName,
        DescriptionShort: RequestedCommand.DescriptionShort || `This is the ${CommandName.toLowerCase()} command.`,
        DescriptionLong: RequestedCommand.DescriptionLong || `This is the ${CommandName.toLowerCase()} command.`,
        IsPremium: RequestedCommand.IsPremium || false,
        IsVoteDependent: RequestedCommand.IsVoteDependent || false,
        IsOwnerDependent: RequestedCommand.IsOwnerDependent || false,
        IsAdminDependent: (function () {
          if (RequestedCommand.IsOwnerDependent) return true;
          else return RequestedCommand.IsAdminDependent || false;
        })(),
        SupportServerOnly: (function () {
          if (RequestedCommand.IsOwnerDependent) return true;
          else return RequestedCommand.SupportServerOnly || false;
        })(),
        PMEnable: (function () {
          if (RequestedCommand.IsOwnerDependent) return false;
          else return RequestedCommand.PMEnable || false;
        })(),
        Released: RequestedCommand.Released || false,
        Usage: RequestedCommand.Usage || `${RequestedCommand.IsOwnerDependent || false ? "!" : "/"}${CommandName.toLowerCase()}`,
        Category: RequestedCommand.Category || "Other",
        RequiedUserPermissions: RequestedCommand.RequiedUserPermissions || [],
        RequiedBotPermissions: RequestedCommand.RequiedBotPermissions || [],
        Path: FilePath
      };
      CommandList[CommandStructured.Name.toLowerCase()] = CommandStructured;
      CommandList[CommandStructured.Name] = CommandStructured.Name.toLowerCase();
    });
    console.info("Commands loaded!");
    NSBR.emit("CommandLoad");
    resolve();
  });
});

//Loading events from folder
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

//Loading fonts from folder
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
      registerFont(join(Fonts, f.toLocaleString()).replace("\\", "/"), { family: `MyFont${name}Font` });
    });
    console.info("Fonts registered!");
    NSBR.emit("FontLoad");
    resolve();
  });
});

//Exporting loading functions
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
