const DELAY = 150;
const ItemsToCount = [];

function ExecuteQuery({ sql }) {
  let Multiplier = ItemsToCount.length;
  ItemsToCount.push("Item");
  var promise = new Promise((resolve, reject) => {
    setTimeout(async function () {
      MySQLPool.query(sql, function (err, res) {
        if (err) throw err;
        console.info(`Query: "${sql}" was executed.`);
        resolve(res)
      });
    }, DELAY * Multiplier);
  });

  setTimeout(async function () {
    ItemsToCount.pop();
  }, DELAY * ItemsToCount.length);
  return promise;
}

module.exports = ExecuteQuery;
