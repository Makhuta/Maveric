const { join } = require("path");
const { EmbedBuilder } = require("discord.js");
const DefaultFunctionsStates = require(join(Configs, "DefaultFunctionsStates.json"));
const { client } = require(DClientLoc);

module.exports = {
  Name: "VariableList",
  DescriptionShort: "This command will show you list of variable configs and their states.",
  DescriptionLong: "This command will show you list of variable configs and their states.",
  Usage: "/variablelist",
  Category: "Moderation",
  IsPremium: false,
  IsVoteDependent: false,
  IsOwnerDependent: false,
  IsAdminDependent: true,
  SupportServerOnly: false,
  PMEnable: false,
  Released: true,
  RequiedUserPermissions: ["ManageGuild"],
  RequiedBotPermissions: ["SendMessages", "ViewChannel"],
  async run(interaction) {
    let GuildID = interaction.guildId;
    let ConfigList = GuildsConfigs[GuildID].config;
    let fields = [];

    for (f in DefaultFunctionsStates) {
      if (DefaultFunctionsStates[f].released) {
        let FunctionValue = ConfigList[DefaultFunctionsStates[f].name] ? ConfigList[DefaultFunctionsStates[f].name] : false;
        if (FunctionValue) {
          FunctionValue = "✅";
        } else {
          FunctionValue = "❌";
        }
        fields.push({
          name: `ㅤ`,
          value: `[**${DefaultFunctionsStates[f].displayName}**](${interaction.url} "Description: ${DefaultFunctionsStates[f].description}")\n${FunctionValue}`,
          inline: true
        });
      }
    }
    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Variable list",
        iconURL: client.user.displayAvatarURL()
      })
      .setColor(require(join(ColorPaletes, "colors.json")).red)
      .setThumbnail("attachment://cogwheel.png")
      .addFields(fields)
      //.addField(`ㅤ\nIf you didn't vote consider voting for me to unlock more features.`, `[TOP.GG](https://top.gg/bot/${process.env.TOPGGID}/vote)`)
      .setFooter({
        text: "Hover over variables for info!"
      })
      .setTimestamp();

    interaction.reply({
      embeds: [embed],
      files: [join(Pictures, "cogwheel.png")],
      ephemeral: true
    });
  },
  async create({ commands, permissions, dmEnabled }) {
    let command = await commands?.create({
      name: this.Name.toLowerCase(),
      description: this.DescriptionShort,
      dmPermission: dmEnabled,
      defaultMemberPermissions: permissions
    });
    return command;
  }
};
