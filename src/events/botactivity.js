const { client, Maveric } = require(DClientLoc);
const { ActivityType } = require("discord.js");
require("dotenv").config();

var typ_aktivity = [
  { name: "/help", type: ActivityType.Listening },
  { name: `Managing $NumberOfGuilds servers.`, type: ActivityType.Watching },
  { name: process.env.SUPPORT_SERVER_INVITE, type: ActivityType.Playing }
];

async function aktivita() {
  let NumberOfGuilds = client.guilds.cache.size;
  let aktivita = typ_aktivity.shift();

  client.user.setActivity(aktivita.name.replace("$NumberOfGuilds", NumberOfGuilds), { type: aktivita.type });
  typ_aktivity.push(aktivita);
}

Maveric.on("EventLoad", () => {
  aktivita();

  setInterval(() => {
    aktivita();
  }, 60000);
});
