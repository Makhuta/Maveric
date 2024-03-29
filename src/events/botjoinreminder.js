const { client } = require(DClientLoc);
const { EmbedBuilder } = require("discord.js");
const { join } = require("path");
const InfoHandler = require(join(Functions, "placeholders/InfoHandler.js"));

client.on("guildCreate", async (guild) => {
  let ownerID = guild.ownerId;
  let owner = await guild.members.fetch(ownerID);
  var embed = new EmbedBuilder()
    .setAuthor({
      name: `Attention`,
      iconURL: client.user.displayAvatarURL()
    })
    .setDescription(`I've been invited to your Discord server: [\`${guild.name}\`](https://discord.com/channels/@me "ID: ${guild.id}").`)
    .setTimestamp()
    .setThumbnail(guild.iconURL())
    .addFields({
      name: "Admin commands",
      value: `Check my admin related commands in server Integrations.\nTutorial can be found [\`here\`](https://discord.com/blog/slash-commands-permissions-discord-apps-bots)`
    })
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL()
    });

  owner.send({ embeds: [embed] }).catch((error) => {
    if (InfoHandler["JoinReminder"] == undefined) {
      InfoHandler["JoinReminder"] = {};
    }
    if (InfoHandler["JoinReminder"][ownerID] == undefined) {
      InfoHandler["JoinReminder"][ownerID] = [];
    }

    InfoHandler["JoinReminder"][ownerID].push({
      ID: ownerID,
      Username: owner.user.username,
      Discriminator: owner.user.discriminator,
      Nickname: owner?.user?.nickname ? owner.user.nickname : "undefined",
      GuildID: guild.id
    });
  });
});
