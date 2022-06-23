const { client, NSBR } = require(DClientLoc);
require("dotenv").config();

var typ_aktivity = [
  { name: "/help", type: "LISTENING" },
  { name: `Managing $NumberOfGuilds servers.`, type: "WATCHING" },
  { name: process.env.NSBR_SERVER_INVITE, type: "PLAYING" }
];

async function aktivita() {
  let NumberOfGuilds = client.guilds.cache.size;
  let aktivita = typ_aktivity.shift();

  client.user.setActivity(
    aktivita.name.replace("$NumberOfGuilds", NumberOfGuilds),
    { type: aktivita.type }
  );
  typ_aktivity.push(aktivita);
}

NSBR.on("EventLoad", () => {
  aktivita();

  setInterval(() => {
    aktivita();
  }, 60000);
});
