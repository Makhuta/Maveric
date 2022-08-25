let { join } = require("path");
const { isUndefined } = require("util");
let DefaultFunctionsStates = require(join(Configs, "DefaultFunctionsStates.json"));
let EventInitializer = require(join(Functions, "guild/EventInitializer.js"));

module.exports = {
  Name: "Initialize",
  DescriptionShort: "This will initialize command.",
  DescriptionLong: "This will initialize command.",
  Usage: "/initialize [event]",
  Category: "Moderation",
  IsAdminDependent: true,
  Released: false,
  RequiedUserPermissions: ["MANAGE_GUILD"],
  RequiedBotPermissions: ["MANAGE_CHANNELS", "VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES"],
  async create({ commands, permissions, dmEnabled }) {
    let choices = [];
    for (DFunction of DefaultFunctionsStates) {
      let PossibleInitialization = DFunction.possibleInit;
      if (isUndefined(PossibleInitialization) || PossibleInitialization < 1) continue;
      for (DFunctionPI of PossibleInitialization) {
        choices.push({
          name: (DFunctionPI.slice(0, 1) + DFunctionPI.slice(1, DFunctionPI.length).toLowerCase()).replace("_", " "),
          value: DFunctionPI
        });
      }
    }
    let options = [
      {
        name: "event",
        description: "Name of event you want to initialize",
        required: true,
        type: CommandTypes.String,
        choices: choices
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
  },
  async run(interaction) {
    await interaction.deferReply();
    const { options } = interaction;
    let RequestedInit = options.getString("event");
    let RequestedInitText = (RequestedInit.slice(0, 1) + RequestedInit.slice(1, RequestedInit.length).toLowerCase()).replace("_", " ")
    interaction.editReply({
      content: "This is test."
    });
    //console.info(GuildsConfigs)
    /*let guildID = message.guildId;
      let guild = await client.guilds.fetch(guildID);
      let authorID = message.author.id;
      let member = await (
        await client.guilds.fetch(guildID)
      ).members.fetch(authorID);*/
    console.info(EventInitializer[RequestedInit]);
  }
};
