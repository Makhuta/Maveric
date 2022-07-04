const { client, NSBR } = require(DClientLoc);
const { join } = require("path");
const InfoHandler = require(join(Functions, "InfoHandler.js"));
const MailSender = require(join(Functions, "MailSender.js"));

function timeConverterJSON(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);
  var year = a.getFullYear().toString();
  var month = a.getMonth().toString().padStart(2, "0");
  var date = a.getDate().toString().padStart(2, "0");
  var hour = a.getHours().toString().padStart(2, "0");
  var min = a.getMinutes().toString().padStart(2, "0");
  var sec = a.getSeconds().toString().padStart(2, "0");
  var time = { year, month, date, hour, min, sec };
  return time;
}

NSBR.on("ready", () => {
  setInterval(function () {
    if (Object.keys(InfoHandler).length < 1) return;

    let { date, month, year, hour, min } = timeConverterJSON(new Date());

    let JSONText = JSON.stringify(InfoHandler, null, 4);
    MailSender({
      attachment: {
        filename: `info_${date}_${month}_${year}_${hour}_${min}.json`,
        content: JSONText
      }
    });
    for (key of Object.keys(InfoHandler)) {
      delete InfoHandler[key];
    }
  }, 3600000); //3600000    1 Hour
});
