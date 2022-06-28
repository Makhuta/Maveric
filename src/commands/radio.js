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

async function EmbedMaker({ station, type }) {
  let promise = new Promise((resolve, reject) => {
    let radioStation = new Parser({
      autoUpdate: false,
      url: station.url
    });

    radioStation.once("metadata", (metadata) => {
      let typesList = [
        { Author: `Started playing from:\n${station.name}`, Color: colors.red },
        {
          Author: `Currently playing from:\n${station.name}`,
          Color: colors.lime
        }
      ];
      let title = metadata.get("StreamTitle");
      let embed = new MessageEmbed()
        .setTitle(title ? title : "Unknown song")
        .setURL(station.url)
        .setColor(typesList[type].Color)
        .setTimestamp()
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL()
        })
        .setAuthor({
          name: typesList[type].Author,
          url: station.url
        });
      resolve(embed);
    });
  });
  return promise;
}

async function joinChannel(UserVoiceChannel, RequestedRadioChannel, guildId) {
  //Joining voice channel
  const VoiceConnection = joinVoiceChannel({
    channelId: UserVoiceChannel.id,
    guildId: UserVoiceChannel.guildId,
    adapterCreator: UserVoiceChannel.guild.voiceAdapterCreator
  });
  //Getting audio resource from url
  const resource = createAudioResource(RequestedRadioChannel.url, {
    inlineVolume: true
  });
  //Setting volume
  resource.volume.setVolume(0.2);
  //Creating player
  const player = createAudioPlayer();
  //Subscribing to player
  VoiceConnection.subscribe(player);
  //Playing resource
  player.play(resource);
  player.on(AudioPlayerStatus.Idle, function () {
    console.info("IDLE");
  });
  //Updating per guild radio variables
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
  helpdescription: "This command will make Bot join your Voice channel and start playing radio station from your choice, if you did not choose station Bot will pick random station from list of available stations.",
  usage: "/radio (station name)",
  helpname: "Radio",
  type: "Global",
  category: "Music",
  PMEnable: false,
  VoteTied: true,
  async run(interaction) {
    const { options, member, guildId } = interaction;
    let UserVoiceChannel = await (await member.fetch()).voice.channel;
    let UserIsInVoiceChannel = !isNull(UserVoiceChannel);

    //Check if user is in voice channel
    if (!UserIsInVoiceChannel) {
      await interaction.deferReply({
        ephemeral: true
      });
      return interaction.editReply({
        content: "You need to be in channel to use the command."
      });
    }

    //Getting per guild radio
    let GuildRadio = RadioHandler[guildId];

    //Getting radio station from interaction
    let RequestedRadioChannel = RadioStations[options.getString("station")];
    let RequestIsUndefined = RequestedRadioChannel == null;

    if (RequestIsUndefined) {
      RequestedRadioChannel =
        RadioStations[randomNum.int(1, Object.keys(RadioStations).length)];
    }

    //If per guild radio not exist then create
    if (isUndefined(GuildRadio)) {
      RadioHandler[guildId] = {
        station: RequestedRadioChannel,
        guildID: guildId,
        player: undefined,
        VoiceConnection: undefined,
        interval: undefined,
        interaction,
        stationcheck: undefined
      };
    } else {
      await interaction.deferReply({
        ephemeral: true
      });
      let embed = await EmbedMaker({
        station: GuildRadio.station,
        type: 1
      });
      return interaction.editReply({
        embeds: [embed]
      });
    }
    await interaction.deferReply();

    joinChannel(UserVoiceChannel, RequestedRadioChannel, guildId);
    var embed = await EmbedMaker({ station: RequestedRadioChannel, type: 0 });

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
          RadioStation.style.slice(0, 1).toUpperCase() +
          RadioStation.style.slice(1, RadioStation.length),
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
