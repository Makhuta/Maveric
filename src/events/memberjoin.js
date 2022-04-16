const moment = require("moment");
const { join } = require("path");
const client = require(DClientLoc).client;

async function uvitani(member) {
  member.guild.channels
    .fetch()
    .then(async (channels) => {
      let channel = channels.filter((chnl) => chnl.topic == `GateRoom`).first();
      let GATE = channels
        .filter((chnl) => chnl.topic == "GateCategory")
        .first();

      await member.guild.roles
        .fetch()
        .then(async (roles) => {
          let role = roles.filter((rle) => rle.name == "Member").first();
          member.roles.add(role);

          if (channel == undefined) {
            let everyone = roles
              .filter((rle) => rle.name == "@everyone")
              .first();
            if (role == undefined) {
              role = await member.guild.roles.create("Member");
            }
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
          }
        })
        .catch((error) => console.error(error));

      if (channel == undefined) return console.error("Channel is Undefined.");

      var datum = moment(member.user.createdAt).format("l").split("/");
      datum = [datum[1], datum[0], datum[2]].join(". ");
      let hodnoty = {
        channel: channel,
        target: member.user,
        stav: "Welcome",
        datum: datum
      };
      require(join(root, "src/canvases/WelcomeCanvas.js")).run(hodnoty);
    })
    .catch((error) => console.error(error));
}

client.on("guildMemberAdd", (member) => {
  if (member.user.bot)
    return console.info(`${member.user.username} was bot skipping.`);
  console.info(`${member.user.username} joined server.`);
  uvitani(member);
});
