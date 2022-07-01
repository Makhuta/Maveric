const { join } = require("path");
const PermissionToArray = require(join(Functions, "PermissionToArray.js"));
const { client } = require(DClientLoc);
const { MessageAttachment } = require("discord.js");
require("dotenv").config();

function timeConverterJSON(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);
  var year = a.getFullYear().toString();
  var month = a.getMonth().toString().padStart(2, "0");
  var date = a.getDate().toString().padStart(2, "0");
  var hour = a.getHours().toString().padStart(2, "0");
  var min = a.getMinutes().toString().padStart(2, "0");
  var sec = a.getSeconds().toString().padStart(2, "0");
  var time = { year, month, date, hour, min, sec };
  return time;
}

function InfoList(Info) {
  this.Guilds = Info.GuildList;
}

function RolesList(guild) {
  this.Roles = {};
  for (r of guild.roles.cache) {
    r = r[1];
    this.Roles[r.id] = {
      ID: parseInt(r.id),
      Name: r.name,
      RawPosition: r.rawPosition,
      Tags: r.tags,
      Managed: r.managed,
      Mentionable: r.mentionable,
      Permissions: PermissionToArray(r.permissions)
    };
  }
}

function MemberList(guild, RList) {
  this.Members = {};
  for (m of guild.members.cache) {
    m = m[1];
    let MemberRolesList = {};
    let MemberRoles = m.roles.cache;
    let { date, month, year } = timeConverterJSON(m.guild.joinedTimestamp);
    for (mr of MemberRoles) {
      MemberRolesList[mr[0]] = RList.Roles[mr[0]];
    }
    this.Members[m.user.id] = {
      ID: parseInt(m.user.id),
      Username: m.user.username,
      Discriminator: m.user.discriminator ? parseInt(m.user.discriminator) : "undefined",
      Nickname: m.nickname ? m.nickname : "undefined",
      Roles: MemberRolesList,
      Bot: m.user.bot,
      JoinedTimestamp: m.guild.joinedTimestamp,
      Joined: `${date}.${month}.${year}`,
      AvatarURL: m.displayAvatarURL()
    };
  }
}

function GuildInfo(guild) {
  guild["Created"] = `${timeConverterJSON(guild.createdAt).date}.${timeConverterJSON(guild.createdAt).month}.${timeConverterJSON(guild.createdAt).year}`;
  let RList = new RolesList(g);
  let MList = new MemberList(g, RList);
  this.ID = parseInt(guild.id);
  this.Name = guild.name;
  this.MemberCount = guild.memberCount;
  this.MemberList = MList;
  this.RolesList = RList;
  this.Created = guild.Created;
  this.Owner = MList.Members[guild.ownerId];
  this.ConfigList = guild.ConfigList;
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
      g["ConfigList"] = GuildsConfigs[g.id].config;

      GuildList[g.id] = new GuildInfo(g);
    }

    let JSONText = JSON.stringify(new InfoList({ GuildList }), null, 4);

    let { date, month, year, hour, min } = timeConverterJSON(new Date());
    let attachment = new MessageAttachment(Buffer.from(JSONText), `info_${date}_${month}_${year}_${hour}_${min}.json`);

    message.author.send({
      files: [attachment]
    });
  }
};
