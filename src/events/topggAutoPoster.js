const { client } = require(DClientLoc);
const { AutoPoster } = require("topgg-autoposter");
require("dotenv").config();

if (process.env.TOPGGENABLE == "true") {
  const poster = AutoPoster(process.env.TOPGGTOKEN, client);
  poster.on("posted", (stats) => {
    // ran when succesfully posted
    console.info(`Posted stats to Top.gg | ${stats.serverCount} servers`);
  });
}
