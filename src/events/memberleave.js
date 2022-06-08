const moment = require("moment");
const { join } = require("path");
const { client } = require(DClientLoc);
const CreateChannel = require(join(Functions, "CreateChannel.js"));
const UpdateVariable = require(join(Functions, "UpdateVariable.js"));

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

  await guild.roles.fetch().then(async (roles) => {
    everyoneRole = roles.filter((rle) => rle.name == "@everyone").first();
  });

  if (configsJSON.GATECATEGORY != "") {
    GateCategory = await guild.channels
      .fetch(configsJSON.GATECATEGORY)
      .catch((error) => console.error("Category not found"));

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
    GateRoom = await guild.channels
      .fetch(configsJSON.GATEROOM)
      .catch((error) => console.error("Gate room not found"));

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
    stav: "Traitor",
    datum: datum
  });
}

client.on("guildMemberRemove", async (member) => {
  if (member.user.bot)
    return console.info(`${member.user.username} was bot skipping.`);
  console.info(`${member.user.username} left server.`);
  configsJSON = GuildsConfigs[member.guild.id]?.config;

  let enabled = configsJSON?.WELCOMER;
  if (enabled) {
    rozlouceni(member);
  }
});
