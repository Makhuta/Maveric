const mysql = require("mysql");
let { join } = require("path");
require("dotenv").config();

global.MySQLPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

require(join(Functions, "LoadGuildsConfigs.js"))();