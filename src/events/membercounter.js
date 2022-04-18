const { client, NSBR } = require(DClientLoc);

function RoomExist(channel) {
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

const updateMembers = async ({ id }) => {
  let guild = await client.guilds.fetch(id);
  let configsJSON = await PoolAccess.GetConfig({ guildID: guild.id });
  if (configsJSON.COUNTENABLE != "true") return;

  let ServerStatsCategory;
  let MemberCountChannel;
  let OnlineCountChannel;
  let OfflineCountChannel;

  let everyoneRole;

  await guild.roles.fetch().then(async (roles) => {
    everyoneRole = roles.filter((rle) => rle.name == "@everyone").first();
  });

  if (configsJSON.SERVERSTATS != "") {
    ServerStatsCategory = await guild.channels
      .fetch(configsJSON.SERVERSTATS)
      .catch((error) => console.error("Category not found"));
    let SSCategoryExist = RoomExist(ServerStatsCategory);
    if (!SSCategoryExist)
      ServerStatsCategory = await CreateChannel({
        name: "📊 Server Stats 📊",
        type: "GUILD_CATEGORY",
        guild,
        everyoneRole
      });
  } else {
    ServerStatsCategory = await CreateChannel({
      name: "📊 Server Stats 📊",
      type: "GUILD_CATEGORY",
      guild,
      everyoneRole
    });
  }

  let MCChannelExist;
  let OnChannelExist;
  let OffChannelExist;

  if (configsJSON.MEMBERCOUNT != "") {
    MemberCountChannel = await guild.channels
      .fetch(configsJSON.MEMBERCOUNT)
      .catch((error) => console.error("Channel not found"));
    MCChannelExist = RoomExist(MemberCountChannel);
    if (!MCChannelExist)
      MemberCountChannel = await CreateChannel({
        name: "Members:",
        type: "GUILD_VOICE",
        guild,
        everyoneRole
      });
  } else {
    MemberCountChannel = await CreateChannel({
      name: "Members:",
      type: "GUILD_VOICE",
      guild,
      everyoneRole
    });
  }

  if (configsJSON.ONLINECOUNT != "") {
    OnlineCountChannel = await guild.channels
      .fetch(configsJSON.ONLINECOUNT)
      .catch((error) => console.error("Channel not found"));
    OnChannelExist = RoomExist(OnlineCountChannel);
    if (!OnChannelExist)
      OnlineCountChannel = await CreateChannel({
        name: "Online:",
        type: "GUILD_VOICE",
        guild,
        everyoneRole
      });
  } else {
    OnlineCountChannel = await CreateChannel({
      name: "Online:",
      type: "GUILD_VOICE",
      guild,
      everyoneRole
    });
  }

  if (configsJSON.OFFLINECOUNT != "") {
    OfflineCountChannel = await guild.channels
      .fetch(configsJSON.OFFLINECOUNT)
      .catch((error) => console.error("Channel not found"));
    OffChannelExist = RoomExist(OfflineCountChannel);
    if (!OffChannelExist)
      OfflineCountChannel = await CreateChannel({
        name: "Offline:",
        type: "GUILD_VOICE",
        guild,
        everyoneRole
      });
  } else {
    OfflineCountChannel = await CreateChannel({
      name: "Offline:",
      type: "GUILD_VOICE",
      guild,
      everyoneRole
    });
  }

  if (!MCChannelExist || !ServerStatsCategory) {
    MemberCountChannel.setParent(ServerStatsCategory);
  }

  if (!OnChannelExist || !ServerStatsCategory) {
    OnlineCountChannel.setParent(ServerStatsCategory);
  }

  if (!OffChannelExist || !ServerStatsCategory) {
    OfflineCountChannel.setParent(ServerStatsCategory);
  }

  guild.members
    .fetch()
    .then(async (members) => {
      const AllMembers = members.filter((m) => !m.user?.bot).size;
      const OnlineMembers = members.filter(
        (m) =>
          !m.user?.bot &&
          (m.presence?.status == "online" ||
            m.presence?.status == "idle" ||
            m.presence?.status == "dnd")
      ).size;
      const OfflineMembers = AllMembers - OnlineMembers;

      MemberCountChannel.setName("Members: " + AllMembers).catch(console.error);
      OnlineCountChannel.setName("Online: " + OnlineMembers).catch(
        console.error
      );
      OfflineCountChannel.setName("Offline: " + OfflineMembers).catch(
        console.error
      );
    })
    .catch((error) => console.error(error));

  await PoolAccess.UpdateMemberCount({
    ServerStats: ServerStatsCategory.id,
    MemberCount: MemberCountChannel.id,
    OnlineCount: OnlineCountChannel.id,
    OfflineCount: OfflineCountChannel.id,
    guildID: guild.id
  });
};

NSBR.on("ready", () => {
  let guilds = client.guilds.cache;
  guilds.forEach((guild) => {
    updateMembers(guild);

    setInterval(() => {
      updateMembers(guild);
    }, 600000);
  });
});

client.on("guildMemberAdd", (member) => {
  updateMembers(member.guild);
});

client.on("guildMemberRemove", (member) => {
  if (member.user.bot) return;
  updateMembers(member.guild);
});

NSBR.on("InitMemberCounter", async () => {
  console.info("Member counter initiated.");
  let guilds = await client.guilds
    .fetch()
    .catch((error) => console.error(error));
  guilds.forEach((guild) => {
    updateMembers(guild);
  });
});
