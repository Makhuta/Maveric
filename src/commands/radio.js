const { MessageEmbed } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require("@discordjs/voice");
const { join } = require("path");
const colors = require(join(ColorPaletes, "colors.json"));
const RadioHandler = require(join(Functions, "RadioHandler.js"));
const RadioStations = require(join(Configs, "RadioStations.json"));
const { client } = require(DClientLoc);
const randomNum = require("random");
const { isNull, isUndefined } = require("util");
const { Parser } = require("icecast-parser");

async function EmbedMaker(RequestedRadioChannel, songname) {
  let embed = new MessageEmbed()
    .setTitle(songname ? songname : "Unknown song")
    .setURL(RequestedRadioChannel.url)
    .setColor(colors.red)
    .setTimestamp()
    .setFooter({
      text: ``,
      iconURL: client.user.displayAvatarURL()
    })
    .setAuthor({
      name: `Playing from:\n${RequestedRadioChannel.name}`,
      url: RequestedRadioChannel.url
    });
  return embed;
}

async function joinChannel(UserVoiceChannel, RequestedRadioChannel, guildId) {
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
  player.on(AudioPlayerStatus.Idle, function() {
    console.info("IDLE")
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

  let GuildRadio = RadioHandler[guildId];

  if (GuildRadio.currentSongParser?.options.url != RequestedRadioChannel) {
    if (isUndefined(GuildRadio.currentSongParser)) {
      RadioHandler[guildId].currentSongParser = new Parser({
        notifyOnChangeOnly: true,
        url: RequestedRadioChannel.url
      });

      RadioHandler[guildId].currentSongParser.on(
        "metadata",
        async (metadata) => {
          let e = await EmbedMaker(
            RequestedRadioChannel,
            metadata.get("StreamTitle")
          );
          GuildRadio.interaction.editReply({
            embeds: [e]
          });
        }
      );
    } else {
      RadioHandler[guildId].currentSongParser.options.url =
        RequestedRadioChannel.url;
    }
  }
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
        station: RequestedRadioChannel,
        guildID: guildId,
        player: undefined,
        VoiceConnection: undefined,
        interval: undefined,
        interaction,
        stationcheck: undefined,
        currentSongParser: undefined
      };
    } else {
      return interaction.reply({
        embeds: [
          await EmbedMaker(
            RequestedRadioChannel,
            GuildRadio.currentSongParser.previousMetadata.get("StreamTitle")
          )
        ],
        ephemeral: true
      });
    }

    await interaction.deferReply();

    joinChannel(UserVoiceChannel, RequestedRadioChannel, guildId);
    var embed = await EmbedMaker(RequestedRadioChannel);

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
