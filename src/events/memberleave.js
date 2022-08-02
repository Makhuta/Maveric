const moment = require("moment");
const { join } = require("path");
const { client } = require(DClientLoc);
const CreateChannel = require(join(Functions, "CreateChannel.js"));
const UpdateVariable = require(join(Functions, "UpdateVariable.js"));
const InfoHandler = require(join(Functions, "InfoHandler.js"));

let configsJSON;

function RoomExist(channel) {
  //console.info(channel)
  if (channel != undefined) return true;
  else return false;
}

async function rozlouceni(member) {
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

  var datum = moment(member.joinedTimestamp).format("l").split("/");
  datum = [datum[1], datum[0], datum[2]].join(". ");
  require(join(Canvases, "WelcomeCanvas.js")).run({
    channel: GateRoom,
    target: member.user,
    stav: "Traitor",
    datum: datum
  });
}

client.on("guildMemberRemove", async (member) => {
  if (InfoHandler["MemberLeave"] == undefined) {
    InfoHandler["MemberLeave"] = {};
  }
  if (InfoHandler["MemberLeave"][member.user.id] == undefined) {
    InfoHandler["MemberLeave"][member.user.id] = [];
  }
  InfoHandler["MemberLeave"][member.user.id].push({
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
  if (enabled && notErrored) {
    rozlouceni(member);
  }
});
