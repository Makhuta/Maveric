global.DClientLoc = __filename;
const { Client, Intents } = require("discord.js");
const client = new Client({ intents: new Intents(32767) });
require("dotenv").config();

client.on("ready", () => {
  //setTimeout(function () {
  console.info(`\nLogged in as ${client.user.tag}.`);
  client.emit("NSBRLoad", client);
  //}, 2000);
});

client.login(process.env.BOT_TOKEN);

module.exports = {
  client: client
};
