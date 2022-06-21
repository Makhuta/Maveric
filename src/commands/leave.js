const { join } = require("path");
const RadioHandler = require(join(Functions, "RadioHandler.js"));
const { client } = require(DClientLoc);
const { isNull, isUndefined } = require("util");

module.exports = {
  name: "Leave",
  description: "This is the leave command.",
  default: true,
  helpdescription: "This is the leave command.",
  usage: "/leave",
  helpname: "Leave",
  type: "Global",
  PMEnable: false,
  async run(interaction) {
    const { options, member, guildId } = interaction;
    let UserVoiceChannel = await (await member.fetch()).voice.channel;
    let BotVoiceChannel = await (
      await (await client.guilds.fetch(guildId)).members.fetch(client.user.id)
    ).voice.channel;
    let UserIsInVoiceChannel = !isNull(UserVoiceChannel);

    //Check if user is in voice channel
    if (!UserIsInVoiceChannel) {
      return interaction.reply({
        content: "You need to be in channel to use the command.",
        ephemeral: true
      });
    } else if (UserVoiceChannel != BotVoiceChannel) {
      return interaction.reply({
        content:
          "You need to be in the same channel with bot to use the command.",
        ephemeral: true
      });
    }

    let GuildRadio = RadioHandler[guildId];

    if (isUndefined(GuildRadio)) {
      return;
    } else {
      try {
        GuildRadio?.player.stop();
      } catch (e) {
        console.error(e);
      }
      try {
        GuildRadio?.VoiceConnection.destroy();
      } catch (e) {
        console.error(e);
      }
      clearInterval(RadioHandler[guildId].interval);
      delete RadioHandler[guildId];
    }

    interaction.reply({
      content: "Goodbye."
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
