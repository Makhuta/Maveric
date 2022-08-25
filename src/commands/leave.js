const { join } = require("path");
const RadioHandler = require(join(Functions, "placeholders/RadioHandler.js"));
const { client } = require(DClientLoc);
const { isNull, isUndefined } = require("util");

module.exports = {
  Name: "Leave",
  DescriptionShort: "This is the leave command for radio.",
  DescriptionLong:
    "Make Bot leave your Voice channel (works only if radio is active)",
  Usage: "/leave",
  Category: "Music",
  IsPremium: false,
  IsVoteDependent: false,
  IsOwnerDependent: false,
  IsAdminDependent: false,
  SupportServerOnly: false,
  PMEnable: false,
  Released: true,
  RequiedUserPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
  RequiedBotPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
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
