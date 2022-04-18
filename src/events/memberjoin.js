const moment = require("moment");
const { join } = require("path");
const { client, NSBR } = require(DClientLoc);

function RoomExist(channel) {
  //console.info(channel)
  if (channel != undefined) return true;
  else return false;
}

async function CreateChannel({ name, type, guild, everyoneRole }) {
  return await guild.channels.create(name, {
    type: type,
    permissionOverwrites: [
      {
        id: everyoneRole.id,
        allow: ["VIEW_CHANNEL"],
        deny: ["CONNECT"]
      }
    ]
  });
}

async function uvitani(member) {
  let guild = member.guild;

  let configsJSON = await PoolAccess.GetConfig({ guildID: guild.id });
  let GChannelExist;
  let GateCategory;
  let GCategoryExist;
  let GateChannel;

  await guild.roles.fetch().then(async (roles) => {
    everyoneRole = roles.filter((rle) => rle.name == "@everyone").first();
  });

  if (configsJSON.GATECATEGORY != "") {
    GateCategory = await guild.channels
      .fetch(configsJSON.GATECATEGORY)
      .catch((error) => console.error("Category not found"));
    GCategoryExist = RoomExist(GateCategory);
    if (!GCategoryExist)
      GateCategory = await CreateChannel({
        name: "GATE",
        type: "GUILD_CATEGORY",
        guild,
        everyoneRole
      });
  } else {
    GateCategory = await CreateChannel({
      name: "GATE",
      type: "GUILD_CATEGORY",
      guild,
      everyoneRole
    });
  }

  if (configsJSON.GATEROOM != "") {
    GateChannel = await guild.channels
      .fetch(configsJSON.GATEROOM)
      .catch((error) => console.error("Category not found"));
    GChannelExist = RoomExist(GateChannel);
    if (!GChannelExist)
      GateChannel = await CreateChannel({
        name: "🚪gate🚪",
        type: "GUILD_TEXT",
        guild,
        everyoneRole
      });
  } else {
    GateChannel = await CreateChannel({
      name: "🚪gate🚪",
      type: "GUILD_TEXT",
      guild,
      everyoneRole
    });
  }

  if (!GChannelExist || !GCategoryExist) {
    GateChannel.setParent(GateCategory);
  }

  await PoolAccess.UpdateGate({
    GateCategory: GateCategory.id,
    GateRoom: GateChannel.id,
    guildID: guild.id
  });

  var datum = moment(member.user.createdAt).format("l").split("/");
  datum = [datum[1], datum[0], datum[2]].join(". ");
  let hodnoty = {
    channel: GateChannel,
    target: member.user,
    stav: "Welcome",
    datum: datum
  };
  require(join(root, "src/canvases/WelcomeCanvas.js")).run(hodnoty);
}

client.on("guildMemberAdd", (member) => {
  if (member.user.bot)
    return console.info(`${member.user.username} was bot skipping.`);
  console.info(`${member.user.username} joined server.`);
  uvitani(member);
  NSBR.emit("userjoin", { userID: member.user.id, guildID: member.guild.id });
});
