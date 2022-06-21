const { client, NSBR } = require(DClientLoc);
require("dotenv").config();

var typ_aktivity = [`Managing $NumberOfGuilds servers.`, process.env.NSBR_SERVER_INVITE];

async function aktivita() {
  let NumberOfGuilds = client.guilds.cache.size;
  let aktivita = typ_aktivity.shift();

  aktivita = aktivita?.replace("$NumberOfGuilds", NumberOfGuilds);

  client.user.setActivity(aktivita, { type: "PLAYING" });
  typ_aktivity.push(aktivita);
}

NSBR.on("EventLoad", () => {
  aktivita();

  setInterval(() => {
    aktivita();
  }, 60000);
});