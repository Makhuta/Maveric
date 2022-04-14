const client = require(DClientLoc).client;

const updateMembers = (guild) => {
  let CategoryCreated = false;
  guild.channels.fetch().then(async (channels) => {
    let MemberCountChannel = channels
      .filter((chnl) => {
        let chnlarray = chnl.name.split(":");
        if (chnlarray[0] == `Members`) return true;
      })
      .first();
    let OnlineCountChannel = channels
      .filter((chnl) => {
        let chnlarray = chnl.name.split(":");
        if (chnlarray[0] == `Online`) return true;
      })
      .first();
    let OfflineCountChannel = channels
      .filter((chnl) => {
        let chnlarray = chnl.name.split(":");
        if (chnlarray[0] == `Offline`) return true;
      })
      .first();
    let StatsChannel = channels
      .filter((chnl) => chnl.name == `📊 Server Stats 📊`)
      .first();

    if (StatsChannel == undefined) {
      await guild.roles.fetch().then(async (roles) => {
        let role = roles.filter((rle) => rle.name == "Member").first();
        let everyone = roles.filter((rle) => rle.name == "@everyone").first();
        if (role == undefined) {
          role = await guild.roles.create("Member");
        }
        StatsChannel = await guild.channels.create(`📊 Server Stats 📊`, {
          type: "GUILD_CATEGORY",
          permissionOverwrites: [
            {
              id: everyone.id,
              allow: [],
              deny: ["VIEW_CHANNEL"]
            },
            {
              id: role.id,
              allow: ["VIEW_CHANNEL"],
              deny: []
            }
          ],
          topic: "StatsCategory"
        });
      });
      CategoryCreated = true;
    }

    if (
      MemberCountChannel == undefined ||
      OnlineCountChannel == undefined ||
      OfflineCountChannel == undefined
    ) {
      await guild.roles.fetch().then(async (roles) => {
        let role = roles.filter((rle) => rle.name == "Member").first();
        let everyone = roles.filter((rle) => rle.name == "@everyone").first();
        if (role == undefined) {
          role = await guild.roles.create("Member");
        }
        if (MemberCountChannel == undefined) {
          MemberCountChannel = await guild.channels.create(`Members: `, {
            type: "GUILD_VOICE",
            permissionOverwrites: [
              {
                id: everyone.id,
                allow: [],
                deny: ["VIEW_CHANNEL"]
              },
            ],
            topic: "MemberCountRoom"
          });
          MemberCountChannel.setParent(StatsChannel);
        }
        if (OnlineCountChannel == undefined) {
          OnlineCountChannel = await guild.channels.create(`Online: `, {
            type: "GUILD_VOICE",
            permissionOverwrites: [
              {
                id: everyone.id,
                allow: [],
                deny: ["VIEW_CHANNEL"]
              },
            ],
            topic: "OnlineCountRoom"
          });
          OnlineCountChannel.setParent(StatsChannel);
        }
        if (OfflineCountChannel == undefined) {
          OfflineCountChannel = await guild.channels.create(`Offline: `, {
            type: "GUILD_VOICE",
            permissionOverwrites: [
              {
                id: everyone.id,
                allow: [],
                deny: ["VIEW_CHANNEL"]
              },
            ],
            topic: "OfflineCountRoom"
          });
          OfflineCountChannel.setParent(StatsChannel);
        }
      });
    }

    if (CategoryCreated) {
      MemberCountChannel.setParent(StatsChannel);
      OnlineCountChannel.setParent(StatsChannel);
      OfflineCountChannel.setParent(StatsChannel);
    }

    guild.members.fetch().then(async (members) => {
      const AllMembers = members.filter((m) => !m.user?.bot).size;
      const OnlineMembers = members.filter(
        (m) =>
          !m.user?.bot &&
          (m.presence?.status == "online" ||
            m.presence?.status == "idle" ||
            m.presence?.status == "dnd")
      ).size;
      const OfflineMembers = AllMembers - OnlineMembers;

      /*console.info(
        `\nMembers: ${AllMembers}\nOnline: ${OnlineMembers}\nOffline: ${OfflineMembers}\n`
      );*/

      MemberCountChannel.setName("Members: " + AllMembers).catch(console.error);
      OnlineCountChannel.setName("Online: " + OnlineMembers).catch(console.error);
      OfflineCountChannel.setName("Offline: " + OfflineMembers).catch(console.error);
    });
  });
};

client.on("ready", () => {
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
  if(member.user.bot) return
  updateMembers(member.guild);
});
