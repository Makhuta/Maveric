const Discord = require("discord.js");
const botconfig = require("./botconfig.json")
const fs = require("fs");
const { clear } = require("console");
const bot = new Discord.Client({ disableEveryone: true });
require("./functions")(bot);

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.accessable = new Discord.Collection();

var con = mysql.createPool({
  host: mysqlconfig.host,
  user: mysqlconfig.user,
  password: mysqlconfig.password,
  database: mysqlconfig.database
});

module.exports = {
  bot: bot,
  con: con
}