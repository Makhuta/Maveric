const { join } = require("path");
const { MessageEmbed } = require("discord.js");
const DefaultFunctionsStates = require(join(
  Configs,
  "DefaultFunctionsStates.json"
));

module.exports = {
  name: "VariableList",
  description:
    "This command will show you list of variable configs and their states.",
  helpdescription:
    "This command will show you list of variabl configs and their states.",
  default: false,
  usage: "/variablelist",
  helpname: "Variable list",
  type: "Global",
  PMEnable: false,
  async run(interaction) {
    let GuildID = interaction.guildId;
    let ConfigList = GuildsConfigs[GuildID].config;
    let fields = [];

    for (f in DefaultFunctionsStates) {
      fields.push({
        name: DefaultFunctionsStates[f].name
          ? DefaultFunctionsStates[f].name
          : "Error",
        value: ConfigList[DefaultFunctionsStates[f].name]
          ? ConfigList[DefaultFunctionsStates[f].name]
          : "Error"
      });
    }
    const embed = new MessageEmbed()
      .setTitle("Variable list")
      .setColor(require(join(ColorPaletes, "colors.json")).red)
      .addFields(fields)
      .setTimestamp();

    interaction.reply({
      embeds: [embed],
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
