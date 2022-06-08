global.DClientLoc = __filename;
const { Client, Intents } = require("discord.js");
const client = new Client({ intents: new Intents(32767) });
const EventEmitter = require("events");
require("dotenv").config();

class MyEmitter extends EventEmitter {}

const NSBR = new MyEmitter();

const promise = new Promise((resolve, reject) => {
  client.on("ready", () => {
    console.info(`\nLogged in as ${client.user.tag}.`);
    resolve();
  });
});

client.login(process.env.BOT_TOKEN);

module.exports = {
  client: client,
  NSBR: NSBR,
  run() {
    return promise;
  }
};
