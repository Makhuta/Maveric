const { client } = require(DClientLoc);
const { MessageAttachment } = require("discord.js");
require("dotenv").config();

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);
  var year = a.getFullYear();
  var month = a.getMonth();
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + "." + month + "." + year;
  return time;
}

module.exports = {
  name: "Info",
  description: "This is the Info command.",
  default: "BotOwner",
  helpdescription: "This is the Info command.",
  usage: "!info",
  helpname: "Info",
  type: "Testing",
  category: "Moderation",
  PMEnable: true,
  async run(message) {
    let GuildList = {};
    for (g of client.guilds.cache) {
      g = g[1];
      let ConfigList = GuildsConfigs[g.id].config;
      let { user } = g.members.cache.get(g.ownerId);
      let GuildInfo = {
        Name: g.name,
        Icon: g.iconURL(),
        MemberCount: g.memberCount,
        Joined: timeConverter(g.joinedTimestamp),
        Owner: {
          ID: user.id,
          Username: user.username,
          Discriminator: user.discriminator,
          AvatarURL: user.displayAvatarURL()
        },
        ConfigList: ConfigList
      };
      GuildList[g.id] = GuildInfo;
    }

    let JSONText = JSON.stringify(GuildList, null, 4);

    let attachment = new MessageAttachment(Buffer.from(JSONText), "info.txt");

    message.author.send({
      files: [attachment]
    });
  }
};
