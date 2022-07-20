const { client } = require(DClientLoc);
const { MessageEmbed } = require("discord.js");

client.on("guildCreate", async (guild) => {
  let ownerID = guild.ownerId;
  let owner = await guild.members.fetch(ownerID);
  var embed = new MessageEmbed()
    .setAuthor({
      name: `Attention`,
      iconURL: client.user.displayAvatarURL()
    })
    .setDescription(`I've been invited to your Discord server: [\`${guild.name}\`](https://discord.com/channels/@me "ID: ${guild.id}").`)
    .setTimestamp()
    .setThumbnail(guild.iconURL())
    .addField(
      "Admin commands",
      `Check my admin related commands in server Integrations.\nTutorial can be found [\`here\`](https://discord.com/blog/slash-commands-permissions-discord-apps-bots)`
    )
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL()
    });

  owner.send({ embeds: [embed] });
});
