const { MessageEmbed } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource
} = require("@discordjs/voice");
const { join } = require("path");
const colors = require(join(ColorPaletes, "colors.json"));
const RadioHandler = require(join(Functions, "RadioHandler.js"));
const MilisecondsToTime = require(join(Functions, "MilisecondsToTime.js"));
const RadioStations = require(join(Configs, "RadioStations.json"));
const { client } = require(DClientLoc);
const randomNum = require("random");
const { isNull, isUndefined } = require("util");

const cooldownLength = 300000;

function joinChannel(UserVoiceChannel, RequestedRadioChannel, guildId) {
  const VoiceConnection = joinVoiceChannel({
    channelId: UserVoiceChannel.id,
    guildId: UserVoiceChannel.guildId,
    adapterCreator: UserVoiceChannel.guild.voiceAdapterCreator
  });
  const resource = createAudioResource(RequestedRadioChannel.url, {
    inlineVolume: true
  });
  resource.volume.setVolume(0.2);
  const player = createAudioPlayer();
  VoiceConnection.subscribe(player);
  player.play(resource);
  player.on("idle", () => {
    try {
      player.stop();
    } catch (e) {
      console.error(e);
    }
    try {
      VoiceConnection.destroy();
    } catch (e) {
      console.error(e);
    }
  });
  RadioHandler[guildId].player = player;
  RadioHandler[guildId].VoiceConnection = VoiceConnection;
  RadioHandler[guildId].interval = setInterval(async () => {
    let GuildRadio = RadioHandler[guildId];
    let BotVoiceChannel = await (
      await (await client.guilds.fetch(guildId)).members.fetch(client.user.id)
    ).voice.channel;

    if (
      !isNull(BotVoiceChannel) &&
      BotVoiceChannel.members.filter((member) => !member.user.bot).size >= 1
    ) {
      return;
    }

    try {
      GuildRadio.player.stop();
    } catch (e) {
      console.error(e);
    }
    try {
      GuildRadio.VoiceConnection.destroy();
    } catch (e) {
      console.error(e);
    }
    clearInterval(RadioHandler[guildId].interval);
    delete RadioHandler[guildId];
  }, 300000); //300000
}

module.exports = {
  name: "Radio",
  description: "This is the radio command.",
  default: true,
  helpdescription: "This is the radio command.",
  usage: "/radio",
  helpname: "Radio",
  type: "Global",
  async run(interaction) {
    const { options, member, guildId } = interaction;
    let UserVoiceChannel = await (await member.fetch()).voice.channel;
    let UserIsInVoiceChannel = !isNull(UserVoiceChannel);

    //Check if user is in voice channel
    if (!UserIsInVoiceChannel) {
      return interaction.reply({
        content: "You need to be in channel to use the command.",
        ephemeral: true
      });
    }

    let GuildRadio = RadioHandler[guildId];

    let RequestedRadioChannel = RadioStations[options.getString("station")];
    let RequestIsUndefined = RequestedRadioChannel == null;

    if (RequestIsUndefined) {
      RequestedRadioChannel =
        RadioStations[randomNum.int(1, Object.keys(RadioStations).length)];
    }

    if (isUndefined(GuildRadio)) {
      RadioHandler[guildId] = {
        cooldownSince: 0,
        station: RequestedRadioChannel,
        guildID: guildId,
        player: undefined,
        VoiceConnection: undefined,
        interval: undefined
      };
      GuildRadio = RadioHandler[guildId];
    }

    if (GuildRadio.cooldownSince > Date.now()) {
      return interaction.reply({
        content: `Command is currently on cooldown with remaining time ${MilisecondsToTime(
          GuildRadio.cooldownSince - Date.now()
        )}.`,
        ephemeral: true
      });
    } else {
      RadioHandler[guildId].cooldownSince = Date.now() + cooldownLength;
    }

    await interaction.deferReply();
    joinChannel(UserVoiceChannel, RequestedRadioChannel, guildId);

    var embed = new MessageEmbed()
      .setTitle(RequestedRadioChannel.name)
      .setURL(RequestedRadioChannel.url)
      .setColor(colors.red)
      .setTimestamp()
      .setFooter({
        text: ``,
        iconURL: client.user.displayAvatarURL()
      })
      .setAuthor({
        name: "Playing:",
        url: "https://ilovemusic.de"
      });

    interaction.editReply({
      embeds: [embed]
    });
  },
  async create({ commands, permissions }) {
    let choices = [];
    for (RadioStationsID in RadioStations) {
      let RadioStation = RadioStations[RadioStationsID];

      choices.push({
        name:
          RadioStation.name.slice(0, 1).toUpperCase() +
          RadioStation.name.slice(1, RadioStation.length),
        value: RadioStationsID
      });
    }
    let options = [
      {
        name: "station",
        description: "Name of station you want to play music from",
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
