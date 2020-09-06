const Discord = require("discord.js");
const botconfig = require("./botconfig.json")
const fs = require("fs");
const { clear } = require("console");
const bot = new Discord.Client({ disableEveryone: true });
const mysql = require('mysql')
require("./functions")(bot);

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.accessable = new Discord.Collection();

var con = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

module.exports = {
  bot: bot,
  con: con
}