//Must be on the top of every code for accessing folders more easilly
require("module-alias/register");
require("dotenv").config();


const nodemailer = require('nodemailer');
const Discord = require("discord.js");
const bot = new Discord.Client({ disableMentions: "everyone", ws: { intents: Discord.Intents.ALL } });
const mysql = require('mysql')


bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.accessable = new Discord.Collection();

require("@src/functions")(bot);

var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.BOT_MAIL,
        pass: process.env.BOT_MAIL_PASS
    }
});

var mailOptions = {
    from: process.env.BOT_MAIL,
    to: process.env.MY_MAIL,
    subject: "BOT ERROR",
};

module.exports = {
    bot: bot,
    pool: pool,
    mail: transporter,
    mailOptions: mailOptions
}