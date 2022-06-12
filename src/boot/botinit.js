const { Client, Intents } = require("discord.js");
const client = new Client({ intents: new Intents(32767) });
const EventEmitter = require("events");
require("dotenv").config();

//Saving this location into globals
global.DClientLoc = __filename;

//Creating NSBR emmiter
class MyEmitter extends EventEmitter {}
const NSBR = new MyEmitter();

//Promise that will resolve when client login
const promise = new Promise((resolve, reject) => {
  client.on("ready", () => {
    console.info(`\nLogged in as ${client.user.tag}.`);
    resolve();
  });
});

//Logging up the client
client.login(process.env.BOT_TOKEN);

//Exporting variables
module.exports = {
  client: client,
  NSBR: NSBR,
  run() {
    return promise;
  }
};
