const Discord = require("discord.js");
const bot = new Discord.Client({ disableMentions: "everyone", ws: { intents: Discord.Intents.ALL } });
const mysql = require('mysql')
const WS = require("./handlers/ws/ws")
require("./functions")(bot);

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.accessable = new Discord.Collection();



var con = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

var ws = new WS("statistics", process.env.PORT || 5665, bot, con)

module.exports = {
  bot: bot,
  con: con
}