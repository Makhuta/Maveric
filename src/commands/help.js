const Discord = require("discord.js");
const { join } = require("path");
const { client } = require(DClientLoc);

module.exports = {
  name: "Help",
  description: "Shows description for commands.",
  usage: `/help command:[command name]`,
  options() {
    let choices = [];

    for (c in CommandList) {
      let cmd = CommandList[c];
      if (cmd.name.toLowerCase() == "test") continue;
      choices.push({
        name: cmd.name,
        value: cmd.filename
      });
      //console.info(cmd);
    }
    return [
      {
        name: "command",
        description: "Write command for which you want the help.",
        required: true,
        type: commandTypes.STRING,
        choices: choices
      }
    ];
  },
  async run(interaction) {
    await interaction.deferReply({ ephemeral: true });

    //

    var { options } = interaction;
    var SelectedCommand = require(join(commands, options.getString("command")));
    var CommandRoles = SelectedCommand.allowedRoles;
    let LetterS = "";
    if (CommandRoles == undefined) CommandRoles = ["Member"];
    if (CommandRoles == "BotOwner") CommandRoles = ["Bot Owner"];
    if (CommandRoles.includes("@everyone"))
      CommandRoles = CommandRoles.filter(function (value, index, arr) {
        return value != "@everyone";
      });
    if (CommandRoles.length > 1) LetterS = "s";
    var embed = new Discord.MessageEmbed();
    var BotAvatarURL = client.user.displayAvatarURL({
      format: "png",
      size: 512
    });
    embed.setTitle("Help");
    embed.addFields(
      {
        name: "Command name",
        value: SelectedCommand.helpname
          ? SelectedCommand.helpname
          : SelectedCommand.name
      },
      {
        name: "Description",
        value: SelectedCommand.helpdescription
          ? SelectedCommand.helpdescription
          : SelectedCommand.description
      },
      {
        name: "Usage",
        value: SelectedCommand.usage
          ? SelectedCommand.usage
          : `/${SelectedCommand.name.toLowerCase()}`
      },
      {
        name: `Required role${LetterS}`,
        value: CommandRoles.join(", ")
      }
    );
    embed.setFooter({ text: client.user.username, iconURL: BotAvatarURL });
    embed.setColor(require(join(colorpaletes, "colors.json")).red);
    embed.setTimestamp();

    //

    await interaction.editReply({ embeds: [embed] });
  },
  create({ commands }) {
    let command = commands?.create({
      name: this.name.toLowerCase(),
      description: this.description,
      options: this.options(),
      code: this.run
    });
    return command;
  }
};
