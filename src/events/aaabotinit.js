global.DClientLoc = __filename;
const { Client, Intents } = require("discord.js");
const client = new Client({ intents: new Intents(32767) });
require("dotenv").config();

client.on("ready", () => {
  console.info(`Logged in as ${client.user.tag}.`);
});

client.login(process.env.BOT_TOKEN);

module.exports = {
  client: client
};