const { join } = require("path");
const DefaultFunctionsStates = require(join(
  Configs,
  "DefaultFunctionsStates.json"
));
const UpdateVariable = require(join(Functions, "UpdateVariable.js"));

module.exports = {
  name: "ChangeVariable",
  description: "This command will let you change server configs",
  helpdescription: "This command will let you change server configs.",
  default: false,
  usage: "/changevariable",
  helpname: "Change variable",
  type: "Global",
  PMEnable: false,
  async run(interaction) {
    const { options } = interaction;
    let guildID = interaction.guildId;
    let OptionName = options.getString("name");
    let OptionVariable = options.getBoolean("value");

    let GuildVariable = GuildsConfigs[guildID].config[OptionName] == "true";
    let IsSimilar = GuildVariable == OptionVariable;
    if (IsSimilar) {
      interaction.reply({
        content: `Variable ${OptionName} is already set to ${OptionVariable}.`,
        ephemeral: true
      });
    } else {
      await UpdateVariable({
        guildID,
        variable: OptionName,
        value: OptionVariable
      });
      interaction.reply({
        content: `Variable ${OptionName} has been set to ${OptionVariable}.`,
        ephemeral: true
      });
    }
  },
  async create({ commands, permissions }) {
    let choices = [];
    for (f in DefaultFunctionsStates) {
      choices.push({
        name: DefaultFunctionsStates[f].name,
        value: DefaultFunctionsStates[f].name
      });
    }
    let options = [
      {
        name: "name",
        description: "Name of variable to change",
        required: true,
        type: CommandTypes.STRING,
        choices: choices
      },
      {
        name: "value",
        description: "Value of the config variable",
        required: true,
        type: CommandTypes.BOOLEAN
      }
    ];
    let command = await commands?.create({
      name: this.name.toLowerCase(),
      description: this.description,
      defaultPermission: permissions,
      options
    });
    return command;
  }
};
