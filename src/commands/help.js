const { MessageEmbed } = require("discord.js");
const { join } = require("path");

module.exports = {
  name: "Help",
  description: "This is the help command.",
  helpdescription: "This is the help command.",
  default: true,
  usage: "/help",
  helpname: "Help",
  type: "Global",
  PMEnable: true,
  async run(interaction) {
    const { options } = interaction;
    let guildID = interaction.guildId;
    let RequestedCommandName = options.getString("name");
    let RequestIsUndefined = RequestedCommandName == null;

    if (!RequestIsUndefined) {
      let cmd = require(CommandList.find((c) => c.Name == RequestedCommandName)
        .Location);
      let fields = [
        {
          name: "Description",
          value: cmd.helpdescription
        },
        {
          name: "Usage",
          value: cmd.usage
        }
      ];
      var embed = new MessageEmbed()
        .setTitle(`${cmd.helpname}`)
        .setColor(require(join(ColorPaletes, "colors.json")).red)
        .addFields(fields)
        .setTimestamp();

      interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    } else {
      let cmds = [];
      for (c in CommandList) {
        if (CommandList[c].Type != "Testing") {
          let cmd = require(CommandList[c].Location);
          cmds.push(cmd.helpname);
        }
      }
      console.info(cmds.join("\n"));
      var embed = new MessageEmbed()
        .setTitle(`Available commands`)
        .setColor(require(join(ColorPaletes, "colors.json")).red)
        .addField("Commands", cmds.join("\n"))
        .setTimestamp();

      interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }
  },
  async create({ commands, permissions }) {
    let choices = [];
    for (f in CommandList) {
      if (CommandList[f].Type != "Testing") {
        choices.push({
          name: CommandList[f].Name,
          value: CommandList[f].Name
        });
      }
    }
    let options = [
      {
        name: "name",
        description: "Name of command you want to help with",
        required: false,
        type: CommandTypes.STRING,
        choices: choices
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
