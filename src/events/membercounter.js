const { client, Maveric } = require(DClientLoc);
const { join } = require("path");
const { isUndefined } = require("util");
const GuildGlobals = require(join(Functions, "placeholders/GuildGlobals.js"));

async function updateMembers(guild, configsJSON, type, UserStart) {
  switch (type) {
    case "ONLINECOUNT":
      let OnlineCountChannelID = configsJSON[type] || "";
      if (OnlineCountChannelID.length < 5) {
        GuildsConfigs[guild.id].config.ONLINE_COUNTER_ENABLED = false;
        return;
      }
      let OnlineCountChannel = await guild.channels.fetch(configsJSON.ONLINECOUNT).catch((error) => {
        GuildsConfigs[guild.id].config.ONLINE_COUNTER_ENABLED = false;
        return;
      });
      if (isUndefined(OnlineCountChannel)) {
        GuildsConfigs[guild.id].config.ONLINE_COUNTER_ENABLED = false;
        return;
      }
      OnlineCountChannel.setName("Online: " + UserStart?.OnlineMembers).catch((error) => {
        GuildsConfigs[guild.id].config.ONLINE_COUNTER_ENABLED = false;
        return;
      });

      break;
    case "OFFLINECOUNT":
      let OfflineCountChannelID = configsJSON[type];
      if (OfflineCountChannelID.length < 5) {
        GuildsConfigs[guild.id].config.OFFLINE_COUNTER_ENABLED = false;
        return;
      }
      let OfflineCountChannel = await guild.channels.fetch(configsJSON.OFFLINECOUNT).catch((error) => {
        GuildsConfigs[guild.id].config.OFFLINE_COUNTER_ENABLED = false;
        return;
      });
      if (isUndefined(OfflineCountChannel)) {
        GuildsConfigs[guild.id].config.OFFLINE_COUNTER_ENABLED = false;
        return;
      }
      OfflineCountChannel.setName("Offline: " + UserStart?.OfflineMembers).catch((error) => {
        GuildsConfigs[guild.id].config.OFFLINE_COUNTER_ENABLED = false;
        return;
      });

      break;
    case "MEMBERCOUNT":
      let MemberCountChannelID = configsJSON[type];
      if (MemberCountChannelID.length < 5) {
        GuildsConfigs[guild.id].config.MEMBERS_COUNTER_ENABLED = false;
        return;
      }
      let MemberCountChannel = await guild.channels.fetch(configsJSON.MEMBERCOUNT).catch((error) => {
        GuildsConfigs[guild.id].config.MEMBERS_COUNTER_ENABLED = false;
        return;
      });
      if (isUndefined(MemberCountChannel)) {
        GuildsConfigs[guild.id].config.MEMBERS_COUNTER_ENABLED = false;
        return;
      }
      MemberCountChannel.setName("Members: " + UserStart?.AllMembers).catch((error) => {
        GuildsConfigs[guild.id].config.MEMBERS_COUNTER_ENABLED = false;
        return;
      });

      break;
    case "SERVERSTATS":
      let ServerStatsCategoryID = configsJSON[type];
      if (ServerStatsCategoryID.length < 5) {
        GuildsConfigs[guild.id].config.STATS_CATEGORY_ENABLED = false;
        return;
      }
      let ServerStatsCategory = await guild.channels.fetch(configsJSON.SERVERSTATS).catch((error) => {
        GuildsConfigs[guild.id].config.STATS_CATEGORY_ENABLED = false;
        return;
      });
      if (isUndefined(ServerStatsCategory)) {
        GuildsConfigs[guild.id].config.STATS_CATEGORY_ENABLED = false;
        return;
      }

      break;
  }
}

Maveric.on("ready", async () => {
  let guilds = client.guilds.cache;
  guilds.forEach(async (guild) => {
    let configsJSON = GuildsConfigs[guild.id]?.config;
    if (!Object.keys(GuildGlobals).includes(guild.id)) {
      GuildGlobals[guild.id] = {};
    }
    if (!Object.keys(GuildsConfigs).includes(guild.id)) {
      GuildsConfigs[guild.id] = { config: {} };
      GuildsConfigs[guild.id].config.COUNTERENABLED = false;
    }

    configsJSON = GuildsConfigs[guild.id]?.config;
    let enabled = configsJSON?.COUNTERENABLED;
    let AnyWorking = configsJSON?.ONLINE_COUNTER_ENABLED || configsJSON?.OFFLINE_COUNTER_ENABLED || configsJSON?.MEMBERS_COUNTER_ENABLED;
    if (enabled && AnyWorking) {
      await guild.members.fetch().then(async (members) => {
        let AllMembers = members.filter((m) => !m.user?.bot).size;
        let OnlineMembers = members.filter((m) => !m.user?.bot && (m.presence?.status == "online" || m.presence?.status == "idle" || m.presence?.status == "dnd")).size;
        let OfflineMembers = AllMembers - OnlineMembers;
        let UserStart = { AllMembers, OnlineMembers, OfflineMembers };
        if (configsJSON?.ONLINE_COUNTER_ENABLED) await updateMembers(guild, configsJSON, "ONLINECOUNT", UserStart);
        if (configsJSON?.OFFLINE_COUNTER_ENABLED) await updateMembers(guild, configsJSON, "OFFLINECOUNT", UserStart);
        if (configsJSON?.MEMBERS_COUNTER_ENABLED) await updateMembers(guild, configsJSON, "MEMBERCOUNT", UserStart);
      });
    } else {
      GuildsConfigs[guild.id].config.ONLINE_COUNTER_ENABLED = false;
      GuildsConfigs[guild.id].config.OFFLINE_COUNTER_ENABLED = false;
      GuildsConfigs[guild.id].config.MEMBERS_COUNTER_ENABLED = false;
      GuildsConfigs[guild.id].config.STATS_CATEGORY_ENABLED = false;
    }

    GuildGlobals[guild.id]["MemberCounterInterval"] = setInterval(async () => {
      configsJSON = GuildsConfigs[guild.id]?.config;
      enabled = configsJSON?.COUNTERENABLED;
      AnyWorking = configsJSON?.ONLINE_COUNTER_ENABLED || configsJSON?.ONLINE_COUNTER_ENABLED || configsJSON?.ONLINE_COUNTER_ENABLED;
      if (enabled && AnyWorking) {
        await guild.members.fetch().then(async (members) => {
          let AllMembers = members.filter((m) => !m.user?.bot).size;
          let OnlineMembers = members.filter((m) => !m.user?.bot && (m.presence?.status == "online" || m.presence?.status == "idle" || m.presence?.status == "dnd")).size;
          let OfflineMembers = AllMembers - OnlineMembers;
          let UserStart = { AllMembers, OnlineMembers, OfflineMembers };
          if (configsJSON?.ONLINE_COUNTER_ENABLED) await updateMembers(guild, configsJSON, "ONLINECOUNT", UserStart);
          if (configsJSON?.OFFLINE_COUNTER_ENABLED) await updateMembers(guild, configsJSON, "OFFLINECOUNT", UserStart);
          if (configsJSON?.MEMBERS_COUNTER_ENABLED) await updateMembers(guild, configsJSON, "MEMBERCOUNT", UserStart);
        });
      }
    }, 600000);
  });
});

client.on("guildMemberAdd", async (member) => {
  if (member.user.bot) return;
  let guild = member.guild;
  let configsJSON = GuildsConfigs[guild.id]?.config;

  let enabled = configsJSON?.COUNTERENABLED;
  let AnyWorking = configsJSON?.ONLINE_COUNTER_ENABLED || configsJSON?.OFFLINE_COUNTER_ENABLED || configsJSON?.MEMBERS_COUNTER_ENABLED;
  if (enabled && AnyWorking) {
    await guild.members.fetch().then(async (members) => {
      let AllMembers = members.filter((m) => !m.user?.bot).size;
      let OnlineMembers = members.filter((m) => !m.user?.bot && (m.presence?.status == "online" || m.presence?.status == "idle" || m.presence?.status == "dnd")).size;
      let OfflineMembers = AllMembers - OnlineMembers;
      let UserStart = { AllMembers, OnlineMembers, OfflineMembers };
      if (configsJSON?.ONLINE_COUNTER_ENABLED) await updateMembers(guild, configsJSON, "ONLINECOUNT", UserStart);
      if (configsJSON?.OFFLINE_COUNTER_ENABLED) await updateMembers(guild, configsJSON, "OFFLINECOUNT", UserStart);
      if (configsJSON?.MEMBERS_COUNTER_ENABLED) await updateMembers(guild, configsJSON, "MEMBERCOUNT", UserStart);
    });
  }
});

client.on("guildMemberRemove", async (member) => {
  if (member.user.bot) return;
  let guild = member.guild;
  let configsJSON = GuildsConfigs[guild.id]?.config;

  let enabled = configsJSON?.COUNTERENABLED;
  let AnyWorking = configsJSON?.ONLINE_COUNTER_ENABLED || configsJSON?.OFFLINE_COUNTER_ENABLED || configsJSON?.MEMBERS_COUNTER_ENABLED;
  if (enabled && AnyWorking) {
    await guild.members.fetch().then(async (members) => {
      let AllMembers = members.filter((m) => !m.user?.bot).size;
      let OnlineMembers = members.filter((m) => !m.user?.bot && (m.presence?.status == "online" || m.presence?.status == "idle" || m.presence?.status == "dnd")).size;
      let OfflineMembers = AllMembers - OnlineMembers;
      let UserStart = { AllMembers, OnlineMembers, OfflineMembers };
      if (configsJSON?.ONLINE_COUNTER_ENABLED) await updateMembers(guild, configsJSON, "ONLINECOUNT", UserStart);
      if (configsJSON?.OFFLINE_COUNTER_ENABLED) await updateMembers(guild, configsJSON, "OFFLINECOUNT", UserStart);
      if (configsJSON?.MEMBERS_COUNTER_ENABLED) await updateMembers(guild, configsJSON, "MEMBERCOUNT", UserStart);
    });
  }
});

client.on("guildCreate", async (guild) => {
  let configsJSON;
  if (!Object.keys(GuildGlobals).includes(guild.id)) {
    GuildGlobals[guild.id] = {};
  }

  GuildGlobals[guild.id]["MemberCounterInterval"] = setInterval(async () => {
    configsJSON = GuildsConfigs[guild.id]?.config;
    enabled = configsJSON?.COUNTERENABLED;
    AnyWorking = configsJSON?.ONLINE_COUNTER_ENABLED || configsJSON?.ONLINE_COUNTER_ENABLED || configsJSON?.ONLINE_COUNTER_ENABLED;
    if (enabled && AnyWorking) {
      await guild.members.fetch().then(async (members) => {
        let AllMembers = members.filter((m) => !m.user?.bot).size;
        let OnlineMembers = members.filter((m) => !m.user?.bot && (m.presence?.status == "online" || m.presence?.status == "idle" || m.presence?.status == "dnd")).size;
        let OfflineMembers = AllMembers - OnlineMembers;
        let UserStart = { AllMembers, OnlineMembers, OfflineMembers };
        if (configsJSON?.ONLINE_COUNTER_ENABLED) await updateMembers(guild, configsJSON, "ONLINECOUNT", UserStart);
        if (configsJSON?.OFFLINE_COUNTER_ENABLED) await updateMembers(guild, configsJSON, "OFFLINECOUNT", UserStart);
        if (configsJSON?.MEMBERS_COUNTER_ENABLED) await updateMembers(guild, configsJSON, "MEMBERCOUNT", UserStart);
      });
    }
  }, 600000);
});

client.on("guildDelete", async (guild) => {
  clearInterval(GuildGlobals[guild.id]["MemberCounterInterval"]);
});
