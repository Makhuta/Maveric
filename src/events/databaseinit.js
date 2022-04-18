const mysql = require("mysql");
require("dotenv").config();

const DELAY = 150;
const ItemsToCount = [];

function GetUserFromDatabase({ user, guildID }) {
  let Multiplier = ItemsToCount.length;
  ItemsToCount.push("Item");
  const promise = new Promise((resolve, reject) => {
    setTimeout(async function () {
      MySQLPool.query(
        `SELECT id AS id, money AS money, bank AS bank FROM ${guildID}_userstats WHERE id=${user.id}`,
        function (err, res) {
          if (err) throw err;
          var OutputJSON = res[0];
          resolve(OutputJSON);
        }
      );
    }, DELAY * Multiplier);
  });

  setTimeout(async function () {
    ItemsToCount.pop();
  }, DELAY * ItemsToCount.length);
  return promise;
}

function PushUserToDatabase() {}

function ExecuteQuery({ sql }) {
  let Multiplier = ItemsToCount.length;
  ItemsToCount.push("Item");
  const promise = new Promise((resolve, reject) => {
    setTimeout(async function () {
      MySQLPool.query(sql, function (err, res) {
        if (err) throw err;
        resolve(`Query: "${sql}" was executed.`);
      });
    }, DELAY * Multiplier);
  });

  setTimeout(async function () {
    ItemsToCount.pop();
  }, DELAY * ItemsToCount.length);
  return promise;
}

global.MySQLPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

global.PoolAccess = {
  GetUserFromDatabase,
  PushUserToDatabase,
  ExecuteQuery
};
