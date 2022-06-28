const { MessageEmbed } = require("discord.js");
const { join } = require("path");
const { isUndefined } = require("util");
const { client } = require(DClientLoc);

module.exports = {
  name: "Help",
  description: "This is the help command.",
  helpdescription: "This is the help command.",
  default: true,
  usage: "/help",
  helpname: "Help",
  type: "Global",
  category: "Main",
  PMEnable: true,
  async run(interaction) {
    if(interaction.guildId == null) {
      interaction["url"] = `https://discord.com/channels/@me`;
    } else {
      interaction["url"] = `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`;
    }
    let cmds = {};
    let CommandNameLength = {};

    for (c in CommandList) {
      if (CommandList[c].Type != "Testing") {
        let cmd = require(CommandList[c].Location);
        let CommandCategory = cmd.category ? cmd.category : "Other";
        if (!Object.keys(cmds).includes(CommandCategory)) {
          cmds[CommandCategory] = [];
          CommandNameLength[CommandCategory] = 0;
        }

        let CMDPopup = `Usage: ${cmd.usage}\nDescription: ${cmd.helpdescription}`

        if (
          cmd.helpname.length <= 10 &&
          CommandNameLength[CommandCategory] <= 10
        ) {
          cmds[CommandCategory].push(
            `[\`${cmd.helpname}\`](${interaction.url} "${CMDPopup}")`
          );
          CommandNameLength[CommandCategory] = +cmd.helpname.length;
        } else {
          cmds[CommandCategory].push(
            `[\`${cmd.helpname}\`](${interaction.url} "${CMDPopup}")\n`
          );
          CommandNameLength[CommandCategory] = cmd.helpname.length;
        }
      }
    }

    var embed = new MessageEmbed()
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
        }
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
        { name: "Other", value: cmds["Other"].join(" "), inline: false }
      );
    }
    embed.addField(
      `Consider voting for me to unlock more features.`,
      `[TOP.GG](https://top.gg/bot/${process.env.TOPGGID}/vote)`
    );

    interaction.reply({
      embeds: [embed],
      files: [join(Pictures, "question_mark.png")],
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
