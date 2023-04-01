let { join } = require("path");
const { isUndefined, inspect, isNull } = require("util");
let DefaultFunctionsStates = require(join(Configs, "DefaultFunctionsStates.json"));
let EventInitializer = require(join(Functions, "guild/EventInitializer.js"));

module.exports = {
  Name: "Initialize",
  DescriptionShort: "This will initialize command.",
  DescriptionLong: "This will initialize command.",
  Usage: "/initialize [event]",
  Category: "Moderation",
  IsAdminDependent: true,
  Released: true,
  RequiedUserPermissions: ["ManageGuild"],
  RequiedBotPermissions: ["ManageChannels", "ViewChannels", "SendMessages", "AttachFiles"],
  async create({ commands, permissions, dmEnabled }) {
    let choices = [];
    for (DFunction of DefaultFunctionsStates) {
      let PossibleInitialization = DFunction.possibleInit;
      if (isUndefined(PossibleInitialization) || PossibleInitialization < 1) continue;
      let PossibleInitializationArray = [];
      for (DFunctionPI of PossibleInitialization) {
        let PossibleInitializationName = DFunctionPI.slice(0, 1) + DFunctionPI.slice(1, DFunctionPI.length).toLowerCase();
        let DescType;
        let DescWarn = "";
        if (PossibleInitializationName.includes("counter")) {
          DescType = "Voice channel";
          DescWarn = " beware of that the chosen channel will be renamed";
        } else if (PossibleInitializationName.includes("category")) {
          DescType = "category";
        } else if (PossibleInitializationName.includes("message")) {
          DescType = "Text channel";
        }
        PossibleInitializationArray.push({
          name: PossibleInitializationName.toLowerCase(),
          description: `Select ${DescType} of your choice${DescWarn}.`,
          type: CommandTypes.Channel,
          value: DFunctionPI,
          required: false
        });
      }
      choices.push({
        name: DFunction.displayName.replace(" ", "_").toLowerCase(),
        description: `This will initialize event of your choice (incorrect channel types, working events will be skipped).`, //Max size
        type: CommandTypes.Subcommand,
        options: PossibleInitializationArray
      });
    }

    let command = await commands?.create({
      name: this.Name.toLowerCase(),
      description: this.DescriptionShort,
      dmPermission: dmEnabled,
      defaultMemberPermissions: permissions,
      options: choices
    });
    return command;
  },
  async run(interaction) {
    await interaction.deferReply();
    const { options } = interaction;
    let RequestedSubcommand = options.getSubcommand();
    let RequestedPossibleInits = DefaultFunctionsStates.find((fn) => fn.displayName.replace(" ", "_").toLowerCase() == RequestedSubcommand);
    let RequestedInits = {};

    for (RequestedPossibleInit of RequestedPossibleInits.possibleInit) {
      let InitName = RequestedPossibleInit.toLowerCase();
      let RequrestedChannel = options.getChannel(InitName);
      if (isNull(RequrestedChannel)) continue;
      if (InitName.includes("counter")) {
        if (RequrestedChannel.type != ChannelTypes.GuildVoice) continue;
      } else if (InitName.includes("category")) {
        if (RequrestedChannel.type != ChannelTypes.GuildCategory) continue;
      } else if (InitName.includes("message")) {
        if (RequrestedChannel.type != ChannelTypes.GuildText) continue;
      }
      let EqualsToAnyInJSON = [];
      for (RequestedInit in RequestedInits) {
        RequestedInit = RequestedInits[RequestedInit].Channel;
        EqualsToAnyInJSON.push(RequrestedChannel.equals(RequestedInit));
      }
      if (EqualsToAnyInJSON.some((e) => e)) continue;
      if (GuildsConfigs[interaction.member.guild.id].config[`${InitName.toUpperCase()}_ENABLED`]) continue;
      RequestedInits[RequestedPossibleInit] = { Channel: RequrestedChannel, Permissions: RequestedPossibleInits.requiredPermissions, CorrespondingVariables: RequestedPossibleInits.correspondingVariables };
    }

    let SuccesfullOperation = await EventInitializer(RequestedInits, interaction);

    interaction.editReply({
      content: `List of operation/s that has been succesfully initialized: ${SuccesfullOperation.join(", ")}`
    });
  }
};
