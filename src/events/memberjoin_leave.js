const { join } = require("path");
const { client } = require(DClientLoc);
const InfoHandler = require(join(Functions, "placeholders/InfoHandler.js"));
const colors = require(join(ColorPaletes, "colors.json"));
const { EmbedBuilder } = require("discord.js");
const { isUndefined } = require("util");

let configsJSON;

function timeConverterJSON(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);
  var year = a.getFullYear().toString();
  var month = a.getMonth().toString().padStart(2, "0");
  var date = a.getDate().toString().padStart(2, "0");
  var hour = a.getHours().toString().padStart(2, "0");
  var min = a.getMinutes().toString().padStart(2, "0");
  var sec = a.getSeconds().toString().padStart(2, "0");
  var time = { year, month, date, hour, min, sec };
  return time;
}

async function CanvasMessage(member, isWelcome) {
  let guild = member.guild;
  let GateRoomID = configsJSON["GATEROOM"];
  if (GateRoomID.length < 5) {
    GuildsConfigs[guild.id].config.WELCOME_MESSAGE_ENABLED = false;
    return;
  }
  let GateRoom = await guild.channels.fetch(GateRoomID).catch((error) => {
    GuildsConfigs[guild.id].config.WELCOME_MESSAGE_ENABLED = false;
    return;
  });
  if (isUndefined(GateRoom)) {
    GuildsConfigs[guild.id].config.WELCOME_MESSAGE_ENABLED = false;
    return;
  }

  var { date, month, year } = timeConverterJSON(isWelcome ? member.user.createdAt : member.joinedTimestamp);
  datum = `${date}. ${month}. ${year}`;
  let attachment = await require(join(Canvases, "WelcomeCanvas.js")).run({
    channel: GateRoom,
    target: member.user,
    stav: isWelcome ? "Welcome" : "Traitor",
    datum: datum
  });

  GateRoom.send({ files: [attachment] }).catch((error) => {
    console.info(error);
    GuildsConfigs[guild.id].config.WELCOME_MESSAGE_ENABLED = false;
    return;
  });
}

async function advertise(member) {
  let { guild } = member;
  let embed = new EmbedBuilder()
    .setTitle(`Thank you for joining \`${guild.name}\``)
    .setDescription(
      `I am part of \`${guild.name}\` since <t:${Math.round(
        guild.members.me.joinedTimestamp / 1000
      )}:D>.\nTo see more info about my features you can type [\`/help\`](https://discord.com/channels/@me) in chat and if you consider to invite me to one of your Discord server/s I will be more than glad to join and offer you everything what I can do.\n\n[Invite Me](https://discord.com/oauth2/authorize?client_id=${
        client.user.id
      }&permissions=1644300856822&scope=bot%20applications.commands)`
    )
    .setColor(colors.red)
    .setTimestamp()
    .setFooter({
      text: client.user.username,
      iconURL: client.user.displayAvatarURL()
    })
    .addField(`ㅤ\nIf you have any problems visit ${client.user.username} support server.`, `[${client.user.username} support](${process.env.NSBR_SERVER_INVITE})`)
    .addField(`Consider voting for me to unlock more features.`, `[TOP.GG](https://top.gg/bot/${process.env.TOPGGID}/vote)`);
  member.send({ embeds: [embed] }).catch((error) => {
    if (InfoHandler["BotAdvertise"] == undefined) {
      InfoHandler["BotAdvertise"] = {};
    }
    if (InfoHandler["BotAdvertise"][member.user.id] == undefined) {
      InfoHandler["BotAdvertise"][member.user.id] = [];
    }
    InfoHandler["BotAdvertise"][member.user.id].push({
      ID: member.user.id,
      Username: member.user.username,
      Discriminator: member.user.discriminator,
      Bot: member.user.bot,
      error
    });
  });
}

client.on("guildMemberAdd", async (member) => {
  if (InfoHandler["MemberJoin"] == undefined) {
    InfoHandler["MemberJoin"] = {};
  }
  if (InfoHandler["MemberJoin"][member.guild.id] == undefined) {
    InfoHandler["MemberJoin"][member.guild.id] = [];
  }
  InfoHandler["MemberJoin"][member.guild.id].push({
    ID: member.user.id,
    Username: member.user.username,
    Discriminator: member.user.discriminator,
    Nickname: member.user.nickname ? member.user.nickname : "undefined",
    Bot: member.user.bot
  });
  if (member.user.bot) {
    return;
  }
  configsJSON = GuildsConfigs[member.guild.id]?.config;

  let enabled = configsJSON?.WELCOMERENABLED;
  let Working = configsJSON?.WELCOME_MESSAGE_ENABLED;
  let BotAdvertisementEnabled = configsJSON?.BOTADVERTISEMENT;
  if (enabled && Working) {
    CanvasMessage(member, true);
  }
  if (BotAdvertisementEnabled) {
    advertise(member);
  }
});

client.on("guildMemberRemove", async (member) => {
  if (InfoHandler["MemberLeave"] == undefined) {
    InfoHandler["MemberLeave"] = {};
  }
  if (InfoHandler["MemberLeave"][member.guild.id] == undefined) {
    InfoHandler["MemberLeave"][member.guild.id] = [];
  }
  InfoHandler["MemberLeave"][member.guild.id].push({
    ID: member.user.id,
    Username: member.user.username,
    Discriminator: member.user.discriminator,
    Nickname: member.user.nickname ? member.user.nickname : "undefined",
    Bot: member.user.bot
  });
  if (member.user.bot) {
    return;
  }
  configsJSON = GuildsConfigs[member.guild.id]?.config;

  let enabled = configsJSON?.WELCOMERENABLED;
  let Working = configsJSON?.WELCOME_MESSAGE_ENABLED;
  let BotAdvertisementEnabled = configsJSON?.BOTADVERTISEMENT;
  if (enabled && Working) {
    CanvasMessage(member, false);
  }
  if (BotAdvertisementEnabled) {
    advertise(member);
  }
});
