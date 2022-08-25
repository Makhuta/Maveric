const { EmbedBuilder } = require("discord.js");
const { join } = require("path");
const { isUndefined } = require("util");
const { client } = require(DClientLoc);
const JSONFilter = require(join(Functions, "global/JSONFilter.js"));

module.exports = {
  Name: "Help",
  DescriptionShort: "This is the help command.",
  DescriptionLong: "This is the help command.",
  Usage: "/help",
  Category: "Main",
  IsPremium: false,
  IsVoteDependent: false,
  IsOwnerDependent: false,
  IsAdminDependent: false,
  SupportServerOnly: false,
  PMEnable: true,
  Released: true,
  RequiedUserPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
  RequiedBotPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
  async run(interaction) {
    let FilteredCommands;
    if (interaction.guildId == null) {
      interaction["url"] = `https://discord.com/channels/@me`;
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
      interaction["url"] = `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`;
      if (interaction.guild.id == process.env.SUPPORT_SERVER_ID) {
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

    let cmds = {};
    let CommandNameLength = {};

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

    var embed = new EmbedBuilder()
      .setAuthor({
        name: `Available commands`,
        iconURL: client.user.displayAvatarURL()
      })
      .setDescription(`Brackets in command usage means different things \`(option)\` means that it is optional \`[option]\` means than it is required.`)
      .setColor(require(join(ColorPaletes, "colors.json")).red)
      .setThumbnail("attachment://question_mark.png")
      .setFooter({
        text: "Hover over commands for info!"
      })
      .setTimestamp();
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

    interaction.reply({
      embeds: [embed],
      files: [join(Pictures, "question_mark.png")],
      ephemeral: true
    });
  },
  async create({ commands, permissions, dmEnabled }) {
    let command = await commands?.create({
      name: this.Name.toLowerCase(),
      description: this.DescriptionShort,
      default_permission: permissions,
      dm_permission: dmEnabled
    });
    return command;
  }
};
