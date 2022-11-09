const mysql = require("mysql");
let { join } = require("path");
require("dotenv").config();


module.exports = new Promise(async (resolve, reject) => {
  //Creating MySQL pool and adding it to globals
  global.MySQLPool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

  //Loading configs of all guilds from Database
  await require(join(Functions, "database/LoadGuildsConfigs.js"))();
  resolve();
})