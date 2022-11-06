const DELAY = 150;
const ItemsToCount = [];

function FunctionConsole(sql, enabled) {
  let sqlWORD = [`Query:`, ""];
  let WordLength = 75;

  for (pos = 0; pos < sql.length; pos += WordLength) {
    sqlWORD.push(sql.slice(pos, pos + WordLength));
  }

  sqlWORD.push(``);

  if (enabled) sqlWORD.push(`was executed.`);
  else sqlWORD.push(`was tested.`);

  console.table(sqlWORD);
  console.info("");
}

function ExecuteQuery({ sql, enabled }) {
  if (typeof enabled == "undefined") enabled = true;

  let Multiplier = ItemsToCount.length;

  if (!enabled) ItemsToCount.push("Item");
  var promise = new Promise((resolve, reject) => {
    if (enabled) {
      setTimeout(async function () {
        MySQLPool.query(sql, function (err, res) {
          if (err) throw err;
          FunctionConsole(sql, enabled);
          resolve(res);
        });
      }, DELAY * Multiplier);
    } else {
      FunctionConsole(sql, enabled);
    }
  });

  setTimeout(async function () {
    ItemsToCount.pop();
  }, DELAY * ItemsToCount.length);
  return promise;
}

module.exports = ExecuteQuery;
