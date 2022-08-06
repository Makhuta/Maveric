const moment = require("moment");
const { join } = require("path");
const { client } = require(DClientLoc);
const CreateChannel = require(join(Functions, "CreateChannel.js"));
const UpdateVariable = require(join(Functions, "UpdateVariable.js"));
const InfoHandler = require(join(Functions, "InfoHandler.js"));
const { MessageEmbed } = require("discord.js");

let configsJSON;

function RoomExist(channel) {
  //console.info(channel)
  if (channel != undefined) return true;
  else return false;
}

async function uvitani(member) {
  let guild = member.guild;
  let GRoomExist;
  let GateCategory;
  let GCategoryExist;
  let GateRoom;
  let everyoneRole;

  await guild.roles
    .fetch()
    .then(async (roles) => {
      everyoneRole = roles.filter((rle) => rle.name == "@everyone").first();
    })
    .catch((error) => {
      InfoHandler["MemberJoinError"] = {};
      if (InfoHandler["MemberJoinError"][guild.id] == undefined) {
        InfoHandler["MemberJoinError"][guild.id] = [];
      }
      InfoHandler["MemberJoinError"][guild.id].push({
        ErrorMessage: error,
        guildID: guild.id
      });
      GuildsConfigs[guild.id]["config"]["WELCOMERENABLEDERRORED"] = "false";
    });

  if (configsJSON.GATECATEGORY != "") {
    GateCategory = await guild.channels.fetch(configsJSON.GATECATEGORY).catch((error) => {
      InfoHandler["MemberJoinError"] = {};
      if (InfoHandler["MemberJoinError"][guild.id] == undefined) {
        InfoHandler["MemberJoinError"][guild.id] = [];
      }
      InfoHandler["MemberJoinError"][guild.id].push({
        ErrorMessage: error,
        guildID: guild.id
      });

      console.error("Category not found");
    });

    GCategoryExist = RoomExist(GateCategory);
    if (!GCategoryExist) {
      GateCategory = await CreateChannel({
        name: "GATE",
        type: "GUILD_CATEGORY",
        guild,
        everyoneRole
      });
    }
  } else {
    GateCategory = await CreateChannel({
      name: "GATE",
      type: "GUILD_CATEGORY",
      guild,
      everyoneRole
    });
  }

  if (configsJSON.GATEROOM != "") {
    GateRoom = await guild.channels.fetch(configsJSON.GATEROOM).catch((error) => {
      InfoHandler["MemberJoinError"] = {};
      if (InfoHandler["MemberJoinError"][guild.id] == undefined) {
        InfoHandler["MemberJoinError"][guild.id] = [];
      }
      InfoHandler["MemberJoinError"][guild.id].push({
        ErrorMessage: error,
        guildID: guild.id
      });

      console.error("Gate room not found");
    });

    GRoomExist = RoomExist(GateRoom);
    if (!GRoomExist) {
      GateRoom = await CreateChannel({
        name: "🚪gate🚪",
        type: "GUILD_TEXT",
        guild,
        everyoneRole
      });
    }
  } else {
    GateRoom = await CreateChannel({
      name: "🚪gate🚪",
      type: "GUILD_TEXT",
      guild,
      everyoneRole
    });
  }

  if (!GRoomExist || !GCategoryExist) {
    GateRoom.setParent(GateCategory);

    UpdateVariable({
      guildID: guild.id,
      variable: "GATECATEGORY",
      value: GateCategory.id
    });

    UpdateVariable({
      guildID: guild.id,
      variable: "GATEROOM",
      value: GateRoom.id
    });
  }

  var datum = moment(member.user.createdAt).format("l").split("/");
  datum = [datum[1], datum[0], datum[2]].join(". ");
  require(join(Canvases, "WelcomeCanvas.js")).run({
    channel: GateRoom,
    target: member.user,
    stav: "Welcome",
    datum: datum
  });
}

async function advertise(member) {
  let { guild } = member;
  let embed = new MessageEmbed()
    .setTitle(`Thank you for joining \`${guild.name}\``)
    .setDescription(
      `I am part of \`${guild.name}\` since <t:${Math.round(guild.me.joinedTimestamp / 1000)}:D>.\nTo see more info about my features you can type [\`/help\`](https://discord.com/channels/@me) in chat and if you consider to invite me to one of your Discord server/s I will be more than glad to join and offer you everything what I can do.\n\n[Invite Me](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=1644300856822&scope=bot%20applications.commands)`
    )
    .setColor(ColorPaletes.red)
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
  if (InfoHandler["MemberJoin"][member.user.id] == undefined) {
    InfoHandler["MemberJoin"][member.user.id] = [];
  }
  InfoHandler["MemberJoin"][member.user.id].push({
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

  let enabled = configsJSON?.WELCOMERENABLED == "true";
  let notErrored = configsJSON?.WELCOMERENABLEDERRORED == "true";
  let BotAdvertisementEnabled = configsJSON?.BOTADVERTISEMENT == "true";
  if (enabled && notErrored) {
    uvitani(member);
  }
  if (BotAdvertisementEnabled) {
    advertise(member);
  }
});
