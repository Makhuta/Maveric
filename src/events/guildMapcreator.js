global.BotGuilds = new Map();

const { client, NSBR } = require(DClientLoc);

NSBR.on("ready", () => {
  client.guilds.fetch().then((guilds) => {
    for (let guild of guilds) {
      BotGuilds.set(guild[0], {});
    }
  });
});

client.on("guildCreate", (guild) => {
  BotGuilds.set(guild.id, {});
});

client.on("guildDelete", (guild) => {
  BotGuilds.delete(guild.id);
});
