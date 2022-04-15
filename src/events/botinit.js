global.DClientLoc = __filename;
const { Client, Intents } = require("discord.js");
const client = new Client({ intents: new Intents(32767) });
const EventEmitter = require("events");
require("dotenv").config();

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

client.on("ready", () => {
  //setTimeout(function () {
  console.info(`\nLogged in as ${client.user.tag}.`);
  myEmitter.emit("botinit");
  //}, 2000);
});

client.login(process.env.BOT_TOKEN);

module.exports = {
  client: client,
  NSBR: myEmitter
};
