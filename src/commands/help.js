const { EmbedBuilder } = require("discord.js");
const { join } = require("path");
const { isUndefined } = require("util");
const { client } = require(DClientLoc);
const JSONFilter = require(join(Functions, "global/JSONFilter.js"));

async function EmbedNoCommandSelected({ embed, InteractionGuildIn }) {
  let cmds = {};
  let CommandNameLength = {};
  let FilteredCommands;
  let { interaction } = InteractionGuildIn;

  if (InteractionGuildIn.has) {
    FilteredCommands = JSONFilter({
      JSONObject: JSONFilter({
        JSONObject: JSONFilter({ JSONObject: CommandList, SearchedElement: "Released", ElementValue: true }),
        SearchedElement: "SupportServerOnly",
        ElementValue: false
      }),
      SearchedElement: "IsOwnerDependent",
      ElementValue: false
    });
  } else {
    if (InteractionGuildIn.ID == process.env.SUPPORT_SERVER_ID) {
      FilteredCommands = JSONFilter({
        JSONObject: JSONFilter({ JSONObject: JSONFilter({ JSONObject: CommandList, SearchedElement: "Released", ElementValue: true }) }),
        SearchedElement: "IsOwnerDependent",
        ElementValue: false
      });
    } else {
      FilteredCommands = JSONFilter({
        JSONObject: JSONFilter({
          JSONObject: JSONFilter({ JSONObject: CommandList, SearchedElement: "Released", ElementValue: true }),
          SearchedElement: "SupportServerOnly",
          ElementValue: false
        }),
        SearchedElement: "IsOwnerDependent",
        ElementValue: false
      });
    }
  }

  for (c in FilteredCommands) {
    let cmd = FilteredCommands[c];
    let CommandCategory = cmd.Category;
    if (!Object.keys(cmds).includes(CommandCategory)) {
      cmds[CommandCategory] = [];
      CommandNameLength[CommandCategory] = 0;
    }

    let CMDPopup = `Usage: ${cmd.Usage}\nDescription: ${cmd.DescriptionLong}`;

    if (cmd.Name.length <= 10 && CommandNameLength[CommandCategory] <= 10) {
      cmds[CommandCategory].push(`[\`${cmd.Name}\`](${interaction.url} "${CMDPopup}")`);
      CommandNameLength[CommandCategory] = +cmd.Name.length;
    } else {
      cmds[CommandCategory].push(`[\`${cmd.Name}\`](${interaction.url} "${CMDPopup}")\n`);
      CommandNameLength[CommandCategory] = cmd.Name.length;
    }
  }

  embed.setAuthor({
    name: `Available commands`,
    iconURL: client.user.displayAvatarURL()
  });
  embed.setDescription(`Brackets in command usage means different things \`(option)\` means that it is optional \`[option]\` means than it is required.`);
  embed.setColor(require(join(ColorPaletes, "colors.json")).red);
  embed.setThumbnail("attachment://question_mark.png");
  embed.setFooter({
    text: "Hover over commands for info!"
  });
  embed.setTimestamp();
  if (isUndefined(cmds["Other"]) || cmds["Other"].length < 1) {
    embed.addFields(
      { name: "Main", value: cmds["Main"].join(" "), inline: true },
      {
        name: "Moderation",
        value: cmds["Moderation"].join(" "),
        inline: true
      },
      {
        name: "Music",
        value: cmds["Music"].join(" "),
        inline: true
      },
      {
        name: `ㅤ\nIf you have other problems visit ${client.user.username} support server.`,
        value: `[${client.user.username} support](${process.env.NSBR_SERVER_INVITE})`
      },
      { name: `Consider voting for me to unlock more features.`, value: `[TOP.GG](https://top.gg/bot/${process.env.TOPGGID}/vote)` }
    );
  } else {
    embed.addFields(
      { name: "Main", value: cmds["Main"].join(" "), inline: true },
      {
        name: "Moderation",
        value: cmds["Moderation"].join(" "),
        inline: true
      },
      {
        name: "Music",
        value: cmds["Music"].join(" "),
        inline: true
      },
      { name: "Other", value: cmds["Other"].join(" "), inline: false },
      {
        name: `ㅤ\nIf you have other problems visit ${client.user.username} support server.`,
        value: `[${client.user.username} support](${process.env.NSBR_SERVER_INVITE})`
      },
      { name: `Consider voting for me to unlock more features.`, value: `[TOP.GG](https://top.gg/bot/${process.env.TOPGGID}/vote)` }
    );
  }

  return embed;
}

async function DefaultCOmmandEmbed({ embed, RequiredCommand, InteractionGuildIn }) {
  let { interaction } = InteractionGuildIn;
  let CommandUsageFormatted = RequiredCommand.Usage.replaceAll("[", "[`")
    .replaceAll("(", "[`")
    .replaceAll("]", `$REQUIRED`)
    .replaceAll(")", `$OPTIONAL`)
    .replaceAll(`$REQUIRED`, `\`](${interaction.url} "This option is required.")`)
    .replaceAll(`$OPTIONAL`, `\`](${interaction.url} "This option is optional.")`);

  embed.setAuthor({
    name: RequiredCommand.Name,
    iconURL: client.user.displayAvatarURL()
  });
  embed.setDescription(RequiredCommand.DescriptionLong);
  embed.setColor(require(join(ColorPaletes, "colors.json")).red);
  embed.setThumbnail("attachment://question_mark.png");
  embed.addFields(
    {
      name: "Usage",
      value: `${CommandUsageFormatted}`,
      inline: true
    },
    { name: "Required permission/s to use", value: `${RequiredCommand.RequiedUserPermissions.join("\n")}`, inline: true },
    {
      name: `ㅤ\nIf you have other problems visit ${client.user.username} support server.`,
      value: `[${client.user.username} support](${process.env.NSBR_SERVER_INVITE})`
    },
    { name: `Consider voting for me to unlock more features.`, value: `[TOP.GG](https://top.gg/bot/${process.env.TOPGGID}/vote)` }
  );
  embed.setTimestamp();

  return embed;
}

module.exports = {
  Name: "Help",
  DescriptionShort: "This is the help command.",
  DescriptionLong: "This is the help command.",
  Usage: "/help (command name)",
  Category: "Main",
  PMEnable: true,
  Released: true,
  RequiedUserPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
  RequiedBotPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
  async run(interaction) {
    await interaction.deferReply();
    const { options } = interaction;
    let HelpCommandName = options.getString("command");
    let CommandHasOption = HelpCommandName != null;
    let InteractionGuildIn = { has: interaction.guildId != null, interaction: interaction };
    if (!InteractionGuildIn.has) {
      interaction["url"] = `https://discord.com/channels/@me`;
    } else {
      interaction["url"] = `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`;
    }

    var embed;

    if (CommandHasOption) {
      let commandEmbed = require(CommandList[HelpCommandName].Path).Help;
      if (isUndefined(commandEmbed)) {
        embed = await DefaultCOmmandEmbed({ embed: new EmbedBuilder(), RequiredCommand: CommandList[HelpCommandName], InteractionGuildIn });
      } else {
        embed = await commandEmbed({ embed: new EmbedBuilder(), InteractionGuildIn });
      }
    } else {
      embed = await EmbedNoCommandSelected({ embed: new EmbedBuilder(), InteractionGuildIn });
    }

    interaction.editReply({
      embeds: [embed],
      files: [join(Pictures, "question_mark.png")],
      ephemeral: true
    });
  },
  async create({ commands, permissions, dmEnabled }) {
    let choices = [];
    let CommandListFiltered = Object.keys(
      JSONFilter({
        JSONObject: JSONFilter({
          JSONObject: JSONFilter({ JSONObject: CommandList, SearchedElement: "Released", ElementValue: true }),
          SearchedElement: "SupportServerOnly",
          ElementValue: false
        }),
        SearchedElement: "IsOwnerDependent",
        ElementValue: false
      })
    );
    for (IndividualCommand of CommandListFiltered) {
      choices.push({
        name: CommandList[IndividualCommand].Name,
        value: CommandList[IndividualCommand].Name.toLowerCase()
      });
    }
    let options = [
      {
        name: "command",
        description: "Name of command you want to help with",
        required: false,
        type: CommandTypes.String,
        choices: choices
      }
    ];
    let command = await commands?.create({
      name: this.Name.toLowerCase(),
      description: this.DescriptionShort,
      default_permission: permissions,
      dm_permission: dmEnabled,
      options
    });
    return command;
  }
};
