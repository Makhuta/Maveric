const { client, NSBR } = require(DClientLoc);
const { join } = require("path");
const CreateChannel = require(join(Functions, "CreateChannel.js"));
const UpdateVariable = require(join(Functions, "UpdateVariable.js"));
const InfoHandler = require(join(Functions, "InfoHandler.js"));

function RoomExist(channel) {
  if (channel != undefined) return true;
  else return false;
}

const updateMembers = async ({ id }, configsJSON) => {
  let guild = await client.guilds.fetch(id);

  let ServerStatsCategory;
  let SSCategoryExist;
  let MemberCountChannel;
  let OnlineCountChannel;
  let OfflineCountChannel;

  let everyoneRole;
  let botRole = client.user;

  await guild.roles
    .fetch()
    .then(async (roles) => {
      everyoneRole = roles.filter((rle) => rle.name == "@everyone").first();
    })
    .catch((error) => {
      InfoHandler["MemberCounterError"] = {};
      if (InfoHandler["MemberCounterError"][guild.id] == undefined) {
        InfoHandler["MemberCounterError"][guild.id] = [];
      }
      InfoHandler["MemberCounterError"][guild.id].push({
        ErrorMessage: error,
        guildID: guild.id
      })
      GuildsConfigs[guild.id]["config"]["COUNTERENABLEDERRORED"] = "false"

      
    });

  if (configsJSON.SERVERSTATS != "") {
    ServerStatsCategory = await guild.channels.fetch(configsJSON.SERVERSTATS).catch((error) => {
      InfoHandler["MemberCounterError"] = {};
      if (InfoHandler["MemberCounterError"][guild.id] == undefined) {
        InfoHandler["MemberCounterError"][guild.id] = [];
      }
      InfoHandler["MemberCounterError"][guild.id].push({
        ErrorMessage: error,
        guildID: guild.id
      })
      GuildsConfigs[guild.id]["config"]["COUNTERENABLEDERRORED"] = "false"

      console.error("Category not found");
    });

    SSCategoryExist = RoomExist(ServerStatsCategory);
    if (!SSCategoryExist) {
      ServerStatsCategory = await CreateChannel({
        name: "📊 Server Stats 📊",
        type: "GUILD_CATEGORY",
        guild,
        everyoneRole,
        BotID: botRole
      });
    }
  } else {
    ServerStatsCategory = await CreateChannel({
      name: "📊 Server Stats 📊",
      type: "GUILD_CATEGORY",
      guild,
      everyoneRole,
      BotID: botRole
    });
  }

  if (!SSCategoryExist) {
    UpdateVariable({
      guildID: guild.id,
      variable: "SERVERSTATS",
      value: ServerStatsCategory.id
    });
  }

  let MCChannelExist;
  let OnChannelExist;
  let OffChannelExist;

  if (configsJSON.MEMBERCOUNT != "") {
    MemberCountChannel = await guild.channels.fetch(configsJSON.MEMBERCOUNT).catch((error) => {
      InfoHandler["MemberCounterError"] = {};
      if (InfoHandler["MemberCounterError"][guild.id] == undefined) {
        InfoHandler["MemberCounterError"][guild.id] = [];
      }
      InfoHandler["MemberCounterError"][guild.id].push({
        ErrorMessage: error,
        guildID: guild.id
      })
      GuildsConfigs[guild.id]["config"]["COUNTERENABLEDERRORED"] = "false"

      console.error("Category not found")
    });

    MCChannelExist = RoomExist(MemberCountChannel);
    if (!MCChannelExist) {
      MemberCountChannel = await CreateChannel({
        name: "Members:",
        type: "GUILD_VOICE",
        guild,
        everyoneRole,
        BotID: botRole
      });
    }
  } else {
    MemberCountChannel = await CreateChannel({
      name: "Members:",
      type: "GUILD_VOICE",
      guild,
      everyoneRole,
      BotID: botRole
    });
  }

  if (!MCChannelExist) {
    UpdateVariable({
      guildID: guild.id,
      variable: "MEMBERCOUNT",
      value: MemberCountChannel.id
    });
  }

  if (configsJSON.ONLINECOUNT != "") {
    OnlineCountChannel = await guild.channels.fetch(configsJSON.ONLINECOUNT).catch((error) => {
      InfoHandler["MemberCounterError"] = {};
      if (InfoHandler["MemberCounterError"][guild.id] == undefined) {
        InfoHandler["MemberCounterError"][guild.id] = [];
      }
      InfoHandler["MemberCounterError"][guild.id].push({
        ErrorMessage: error,
        guildID: guild.id
      })
      GuildsConfigs[guild.id]["config"]["COUNTERENABLEDERRORED"] = "false"
      
      console.error("Category not found")});

    OnChannelExist = RoomExist(OnlineCountChannel);
    if (!OnChannelExist) {
      OnlineCountChannel = await CreateChannel({
        name: "Online:",
        type: "GUILD_VOICE",
        guild,
        everyoneRole,
        BotID: botRole
      });
    }
  } else {
    OnlineCountChannel = await CreateChannel({
      name: "Online:",
      type: "GUILD_VOICE",
      guild,
      everyoneRole,
      BotID: botRole
    });
  }

  if (!OnChannelExist) {
    UpdateVariable({
      guildID: guild.id,
      variable: "ONLINECOUNT",
      value: OnlineCountChannel.id
    });
  }

  if (configsJSON.OFFLINECOUNT != "") {
    OfflineCountChannel = await guild.channels.fetch(configsJSON.OFFLINECOUNT).catch((error) => {
      InfoHandler["MemberCounterError"] = {};
      if (InfoHandler["MemberCounterError"][guild.id] == undefined) {
        InfoHandler["MemberCounterError"][guild.id] = [];
      }
      InfoHandler["MemberCounterError"][guild.id].push({
        ErrorMessage: error,
        guildID: guild.id
      })
      GuildsConfigs[guild.id]["config"]["COUNTERENABLEDERRORED"] = "false"

      console.error("Category not found")});

    OffChannelExist = RoomExist(OfflineCountChannel);
    if (!OffChannelExist) {
      OfflineCountChannel = await CreateChannel({
        name: "Offline:",
        type: "GUILD_VOICE",
        guild,
        everyoneRole,
        BotID: botRole
      });
    }
  } else {
    OfflineCountChannel = await CreateChannel({
      name: "Offline:",
      type: "GUILD_VOICE",
      guild,
      everyoneRole,
      BotID: botRole
    });
  }

  if (!OffChannelExist) {
    UpdateVariable({
      guildID: guild.id,
      variable: "OFFLINECOUNT",
      value: OfflineCountChannel.id
    });
  }

  if (!MCChannelExist || !SSCategoryExist) {
    MemberCountChannel?.setParent(ServerStatsCategory).catch((error) => {
      InfoHandler["MemberCounterError"] = {};
      if (InfoHandler["MemberCounterError"][guild.id] == undefined) {
        InfoHandler["MemberCounterError"][guild.id] = [];
      }
      InfoHandler["MemberCounterError"][guild.id].push({
        ErrorMessage: error,
        guildID: guild.id
      })
      GuildsConfigs[guild.id]["config"]["COUNTERENABLEDERRORED"] = "false"

      });
  }

  if (!OnChannelExist || !SSCategoryExist) {
    OnlineCountChannel?.setParent(ServerStatsCategory).catch((error) => {
            InfoHandler["MemberCounterError"] = {};
      if (InfoHandler["MemberCounterError"][guild.id] == undefined) {
        InfoHandler["MemberCounterError"][guild.id] = [];
      }
      InfoHandler["MemberCounterError"][guild.id].push({
        ErrorMessage: error,
        guildID: guild.id
      })
      GuildsConfigs[guild.id]["config"]["COUNTERENABLEDERRORED"] = "false"

      });
  }

  if (!OffChannelExist || !SSCategoryExist) {
    OfflineCountChannel?.setParent(ServerStatsCategory).catch((error) => {
            InfoHandler["MemberCounterError"] = {};
      if (InfoHandler["MemberCounterError"][guild.id] == undefined) {
        InfoHandler["MemberCounterError"][guild.id] = [];
      }
      InfoHandler["MemberCounterError"][guild.id].push({
        ErrorMessage: error,
        guildID: guild.id
      })
      GuildsConfigs[guild.id]["config"]["COUNTERENABLEDERRORED"] = "false"

      });
  }

  guild.members
    .fetch()
    .then(async (members) => {
      const AllMembers = members.filter((m) => !m.user?.bot).size;
      const OnlineMembers = members.filter((m) => !m.user?.bot && (m.presence?.status == "online" || m.presence?.status == "idle" || m.presence?.status == "dnd")).size;
      const OfflineMembers = AllMembers - OnlineMembers;

      MemberCountChannel.setName("Members: " + AllMembers).catch((error) => {
              InfoHandler["MemberCounterError"] = {};
      if (InfoHandler["MemberCounterError"][guild.id] == undefined) {
        InfoHandler["MemberCounterError"][guild.id] = [];
      }
      InfoHandler["MemberCounterError"][guild.id].push({
        ErrorMessage: error,
        guildID: guild.id
      })
      GuildsConfigs[guild.id]["config"]["COUNTERENABLEDERRORED"] = "false"
      });
      OnlineCountChannel.setName("Online: " + OnlineMembers).catch((error) => {
              InfoHandler["MemberCounterError"] = {};
      if (InfoHandler["MemberCounterError"][guild.id] == undefined) {
        InfoHandler["MemberCounterError"][guild.id] = [];
      }
      InfoHandler["MemberCounterError"][guild.id].push({
        ErrorMessage: error,
        guildID: guild.id
      })
      GuildsConfigs[guild.id]["config"]["COUNTERENABLEDERRORED"] = "false"
      });
      OfflineCountChannel.setName("Offline: " + OfflineMembers).catch((error) => {
              InfoHandler["MemberCounterError"] = {};
      if (InfoHandler["MemberCounterError"][guild.id] == undefined) {
        InfoHandler["MemberCounterError"][guild.id] = [];
      }
      InfoHandler["MemberCounterError"][guild.id].push({
        ErrorMessage: error,
        guildID: guild.id
      })
      GuildsConfigs[guild.id]["config"]["COUNTERENABLEDERRORED"] = "false"
      });
    })
    .catch((error) => {
      InfoHandler["MemberCounterError"] = {};
      if (InfoHandler["MemberCounterError"][guild.id] == undefined) {
        InfoHandler["MemberCounterError"][guild.id] = [];
      }
      InfoHandler["MemberCounterError"][guild.id].push({
        ErrorMessage: error,
        guildID: guild.id
      })
      GuildsConfigs[guild.id]["config"]["COUNTERENABLEDERRORED"] = "false"

      });
};

async function SwitchCounter({ guildID }) {}

NSBR.on("ready", async () => {
  let guilds = client.guilds.cache;
  guilds.forEach(async (guild) => {
    let configsJSON = GuildsConfigs[guild.id]?.config;

    let enabled = configsJSON?.COUNTERENABLED == "true";
    let notErrored = configsJSON?.COUNTERENABLEDERRORED == "true";
    if (enabled && notErrored) {
      updateMembers(guild, configsJSON);
    }

    setInterval(() => {
      enabled = configsJSON?.COUNTERENABLED == "true";
      notErrored = configsJSON?.COUNTERENABLEDERRORED == "true";
      if (enabled && notErrored) {
        updateMembers(guild, configsJSON);
      }
    }, 600000);
  });
});

client.on("guildMemberAdd", async (member) => {
  if (member.user.bot) return;
  let configsJSON = GuildsConfigs[member.guild.id]?.config;

  let enabled = configsJSON?.COUNTERENABLED == "true";
  let notErrored = configsJSON?.COUNTERENABLEDERRORED == "true";
  if (enabled && notErrored) {
    updateMembers(member.guild, configsJSON);
  }
});

client.on("guildMemberRemove", async (member) => {
  if (member.user.bot) return;
  let configsJSON = GuildsConfigs[member.guild.id]?.config;

  let enabled = configsJSON?.COUNTERENABLED == "true";
  let notErrored = configsJSON?.COUNTERENABLEDERRORED == "true";
  if (enabled && notErrored) {
    updateMembers(member.guild, configsJSON);
  }
});
