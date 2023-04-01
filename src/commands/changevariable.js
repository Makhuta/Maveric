const { join } = require("path");
const DefaultFunctionsStates = require(join(Configs, "DefaultFunctionsStates.json"));
const UpdateVariable = require(join(Functions, "database/UpdateVariable.js"));

module.exports = {
  Name: "ChangeVariable",
  DescriptionShort: "This command will let you change server configs",
  DescriptionLong: "This command will let you change server configs.",
  Usage: "/changevariable [variable] [state]",
  Category: "Moderation",
  IsAdminDependent: true,
  PMEnable: false,
  Released: true,
  RequiedUserPermissions: ["ManageGuild"],
  RequiedBotPermissions: ["SendMessages", "ViewChannel"],
  async run(interaction) {
    const { options } = interaction;
    let guildID = interaction.guildId;
    let OptionName = options.getString("name");
    let OptionVariable = options.getBoolean("value");

    let GuildVariable = GuildsConfigs[guildID].config[OptionName];
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
  async create({ commands, permissions, dmEnabled }) {
    let choices = [];
    for (f in DefaultFunctionsStates) {
      if (DefaultFunctionsStates[f].released) {
        choices.push({
          name: DefaultFunctionsStates[f].name,
          value: DefaultFunctionsStates[f].name
        });
      }
    }
    let options = [
      {
        name: "name",
        description: "Name of variable to change",
        required: true,
        type: CommandTypes.String,
        choices: choices
      },
      {
        name: "value",
        description: "Value of the config variable",
        required: true,
        type: CommandTypes.Boolean
      }
    ];
    let command = await commands?.create({
      name: this.Name.toLowerCase(),
      description: this.DescriptionShort,
      dmPermission: dmEnabled,
      defaultMemberPermissions: permissions,
      options
    });
    return command;
  }
};
