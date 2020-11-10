const Discord = require("discord.js");
const bot = new Discord.Client({ disableMentions: "everyone", ws: { intents: Discord.Intents.ALL } });
const mysql = require('mysql')
const WS = require("./handlers/ws/ws")
const mysqlconfig = require("./mysqlconfig.json")
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

var ws = new WS("statistics", process.env.PORT || 5665, bot, con)

module.exports = {
  bot: bot,
  con: con
}