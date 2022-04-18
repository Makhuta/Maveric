const Discord = require("discord.js");
const { client } = require(DClientLoc);
const { join } = require("path");

module.exports = {
  name: "Money",
  description: "This command will show your current Money balance.",
  usage: "/money",
  helpname: "Money",
  async run(interaction) {
    await interaction.deferReply();
    let userstats = await PoolAccess.GetUserFromDatabase({
      user: interaction.user,
      guildID: interaction.guildId
    });

    var embed = new Discord.MessageEmbed();
    var BotAvatarURL = client.user.displayAvatarURL({
      format: "png",
      size: 512
    });
    embed.setTitle("Balance");
    embed.addFields(
      {
        name: "Money",
        value: `${userstats.money.toLocaleString()} $`,
        inline: true
      },
      {
        name: "Bank",
        value: `${userstats.bank.toLocaleString()} $`,
        inline: true
      }
    );
    embed.setFooter({ text: client.user.username, iconURL: BotAvatarURL });
    embed.setColor(require(join(colorpaletes, "colors.json")).red);
    embed.setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
  create({ commands }) {
    let command = commands?.create({
      name: this.name.toLowerCase(),
      description: this.description,
      code: this.run
    });
    return command;
  }
};
