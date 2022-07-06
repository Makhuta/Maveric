const { join } = require("path");
const { MessageEmbed } = require("discord.js");
const DefaultFunctionsStates = require(join(Configs, "DefaultFunctionsStates.json"));
const { client } = require(DClientLoc);

module.exports = {
  name: "VariableList",
  description: "This command will show you list of variable configs and their states.",
  helpdescription: "This command will show you list of variable configs and their states.",
  default: false,
  usage: "/variablelist",
  helpname: "Variable list",
  type: "Global",
  category: "Moderation",
  PMEnable: false,
  async run(interaction) {
    let GuildID = interaction.guildId;
    let ConfigList = GuildsConfigs[GuildID].config;
    let fields = [];

    for (f in DefaultFunctionsStates) {
      if (DefaultFunctionsStates[f].released) {
        let FunctionValue = ConfigList[DefaultFunctionsStates[f].name] ? ConfigList[DefaultFunctionsStates[f].name] : "Error";
        if (FunctionValue == "true") {
          FunctionValue = "✅";
        } else if (FunctionValue == "false") {
          FunctionValue = "❌";
        }
        fields.push({
          name: `ㅤ`,
          value: `[**${DefaultFunctionsStates[f].displayName}**](${interaction.url} "Description: ${DefaultFunctionsStates[f].description}")\n${FunctionValue}`,
          inline: true
        });
      }
    }
    const embed = new MessageEmbed()
      .setAuthor({
        name: "Variable list",
        iconURL: client.user.displayAvatarURL()
      })
      .setColor(require(join(ColorPaletes, "colors.json")).red)
      .setThumbnail("attachment://cogwheel.png")
      .addFields(fields)
      .addField(`ㅤ\nIf you didn't vote consider voting for me to unlock more features.`, `[TOP.GG](https://top.gg/bot/${process.env.TOPGGID}/vote)`)
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
  async create({ commands, permissions }) {
    let command = await commands?.create({
      name: this.name.toLowerCase(),
      description: this.description,
      defaultPermission: permissions
    });
    return command;
  }
};
