const { client, NSBR } = require(DClientLoc);

var typ_aktivity = [`Managing $NumberOfGuilds servers.`, "discord.gg/N7fxaAC"];

async function aktivita() {
  let NumberOfGuilds = (await client.guilds.fetch()).size;
  let aktivita = typ_aktivity.shift();

  aktivita = aktivita.replace("$NumberOfGuilds", NumberOfGuilds);

  client.user.setActivity(aktivita, { type: "PLAYING" });
  typ_aktivity.push(aktivita);
}

NSBR.on("EventsLoad", () => {
  aktivita();

  setInterval(() => {
    aktivita();
  }, 60000);
});