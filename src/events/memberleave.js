const moment = require("moment");
const { join } = require("path");
const client = require(DClientLoc).client;

function rozlouceni(member) {
  member.guild.channels
    .fetch()
    .then(async (channels) => {
      let channel = channels.filter((chnl) => chnl.topic == "GateRoom").first();
      let GATE = channels
        .filter((chnl) => chnl.topic == "GateCategory")
        .first();

      if (channel == undefined) {
        await member.guild.roles
          .fetch()
          .then(async (roles) => {
            let role = roles.filter((rle) => rle.name == "Member").first();
            let everyone = roles
              .filter((rle) => rle.name == "@everyone")
              .first();
            if (role == undefined) {
              role = await member.guild.roles.create("Member");
            }
            //console.info(role);
            channel = await member.guild.channels.create(
              `🚪${member.guild.name}-gate🚪`,
              {
                type: "GUILD_TEXT",
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
                topic: "GateRoom"
              }
            );
            if (GATE == undefined) {
              GATE = await member.guild.channels.create("Gate", {
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
                topic: "GateCategory"
              });
            }
            channel.setParent(GATE);
          })
          .catch((error) => console.error(error));
      }

      var datum = moment(member.joinedTimestamp).format("l").split("/");
      datum = [datum[1], datum[0], datum[2]].join(". ");
      let hodnoty = {
        channel: channel,
        target: member.user,
        stav: "Traitor",
        datum: datum
      };
      require(join(root, "src/canvases/WelcomeCanvas.js")).run(hodnoty);
    })
    .catch((error) => console.error(error));
}

client.on("guildMemberRemove", (member) => {
  if (member.user.bot)
    return console.info(`${member.user.username} was bot skipping.`);
  console.info(`${member.user.username} left server.`);
  //console.info(member.user.bot)
  rozlouceni(member);
});
