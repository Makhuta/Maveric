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

function GetConfig({ guildID }) {
  let Multiplier = ItemsToCount.length;
  ItemsToCount.push("Item");
  const promise = new Promise((resolve, reject) => {
    setTimeout(async function () {
      let sql = `SELECT * FROM ${guildID}_config`;
      MySQLPool.query(sql, function (err, res) {
        if (err) throw err;
        let configs = {};
        for (let c of res) {
          configs[c.config_name] = c.config_value;
        }
        resolve(configs);
      });
    }, DELAY * Multiplier);
  });

  setTimeout(async function () {
    ItemsToCount.pop();
  }, DELAY * ItemsToCount.length);
  return promise;
}

function UpdateMemberCount({
  ServerStats,
  MemberCount,
  OnlineCount,
  OfflineCount,
  guildID
}) {
  let Multiplier = ItemsToCount.length;
  ItemsToCount.push("Item");
  const promise = new Promise((resolve, reject) => {
    setTimeout(async function () {
      let sql = `INSERT INTO ${guildID}_config (config_name, config_value) VALUES ("SERVERSTATS", "${ServerStats}"),("MEMBERCOUNT", "${MemberCount}"),("ONLINECOUNT", "${OnlineCount}"),("OFFLINECOUNT", "${OfflineCount}") ON DUPLICATE KEY UPDATE config_name=VALUES(config_name),config_value=VALUES(config_value);`;
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

function UpdateGate({
  GateCategory,
  GateRoom,
  guildID
}) {
  let Multiplier = ItemsToCount.length;
  ItemsToCount.push("Item");
  const promise = new Promise((resolve, reject) => {
    setTimeout(async function () {
      let sql = `INSERT INTO ${guildID}_config (config_name, config_value) VALUES ("GATECATEGORY", "${GateCategory}"),("GATEROOM", "${GateRoom}") ON DUPLICATE KEY UPDATE config_name=VALUES(config_name),config_value=VALUES(config_value);`;
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
  ExecuteQuery,
  GetConfig,
  UpdateMemberCount,
  UpdateGate
};
