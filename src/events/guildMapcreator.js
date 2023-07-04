global.BotGuilds = new Map();

const { client, Maveric } = require(DClientLoc);
const { MessageBuilder, Webhook } = require("discord-webhook-node");

const ServerStatsHook = new Webhook(process.env.SERVER_STATS_WEBHOOK);

async function StatsEmbedCreator({ guild, add }) {
  let { id, name, icon, memberCount, joinedTimestamp, ownerId } = guild;
  let GuildInfo = {
    ID: id,
    Name: name,
    Icon: icon,
    IconURL: icon ? `https://cdn.discordapp.com/icons/${id}/${icon}.webp?size=512` : `https://cdn.discordapp.com/embed/avatars/1.png`,
    MamberCount: memberCount,
    JoinedTimestamp: Math.round(joinedTimestamp / 1000),
    OwnerID: ownerId,
    GuildNumber: client.guilds.cache.size
  };

  let embed = new MessageBuilder()
    .setTitle(`Server ${add ? "added" : "removed"}`)
    .setDescription(`${client.user.username} has been ${add ? "added to" : "removed from"} server: \`${GuildInfo.Name}\``)
    .setColor("RANDOM")
    .setThumbnail(GuildInfo.IconURL)
    .addField("Server name:", `\`${GuildInfo.Name}\``, true)
    .addField("Server ID:", GuildInfo.ID, true)
    .addField("Member count:", GuildInfo.MamberCount, true)
    .addField("Server owner:", `<@${GuildInfo.OwnerID}>`, true)
    .addField(`${client.user.username} is watching:`, `${GuildInfo.GuildNumber} servers`, true)
    .addField("Joined on:", `<t:${GuildInfo.JoinedTimestamp}:D>`, true)
    .setThumbnail(GuildInfo.IconURL)
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()

  return embed;
}

Maveric.on("ready", () => {
  client.guilds
    .fetch()
    .then((guilds) => {
      for (let guild of guilds) {
        BotGuilds.set(guild[0], {});
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

client.on("guildCreate", async (guild) => {
  BotGuilds.set(guild.id, {});
  let embed = await StatsEmbedCreator({ guild, add: true });
  ServerStatsHook.send(embed);
});

client.on("guildDelete", async (guild) => {
  BotGuilds.delete(guild.id);
  let embed = await StatsEmbedCreator({ guild, add: false });
  ServerStatsHook.send(embed);
});
