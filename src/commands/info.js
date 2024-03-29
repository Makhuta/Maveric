const { join } = require("path");
const PermissionToArray = require(join(Functions, "global/PermissionToArray.js"));
const MailSender = require(join(Functions, "global/MailSender.js"));
const InfoHandler = require(join(Functions, "placeholders/InfoHandler.js"));
const { client } = require(DClientLoc);
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
  this.LastHourOfLogs = Info.InfoHandler;
}

function RolesList(guild) {
  this.Roles = {};
  for (r of guild.roles.cache) {
    r = r[1];
    this.Roles[r.id] = {
      ID: r.id,
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
  this.Bots = {};
  this.Members = {};
  for (m of guild.members.cache) {
    m = m[1];
    let MemberRolesList = {};
    let MemberRoles = m.roles.cache;
    let { date, month, year } = timeConverterJSON(m.guild.joinedTimestamp);
    for (mr of MemberRoles) {
      MemberRolesList[mr[0]] = RList.Roles[mr[0]];
    }
    if (m.user.bot) {
      this.Bots[m.user.id] = {
        ID: m.user.id,
        Username: m.user.username,
        Discriminator: m.user.discriminator ? m.user.discriminator : "undefined",
        Nickname: m.nickname ? m.nickname : "undefined",
        Roles: MemberRolesList,
        JoinedTimestamp: m.guild.joinedTimestamp,
        Joined: `${date}.${month}.${year}`,
        AvatarURL: m.displayAvatarURL()
      };
    } else {
      this.Members[m.user.id] = {
        ID: m.user.id,
        Username: m.user.username,
        Discriminator: m.user.discriminator ? m.user.discriminator : "undefined",
        Nickname: m.nickname ? m.nickname : "undefined",
        Roles: MemberRolesList,
        JoinedTimestamp: m.guild.joinedTimestamp,
        Joined: `${date}.${month}.${year}`,
        AvatarURL: m.displayAvatarURL()
      };
    }
  }
}

function ChannelList(guild) {
  let TextChannels = {};
  let VoiceChannels = {};
  let CategoryChannels = {};
  let Structured = {};
  let All = {};

  for (ch of guild.ChannelList) {
    if (ch.Type == "GUILD_VOICE") {
      VoiceChannels[ch.ID] = {
        ID: ch.ID,
        Name: ch.Name,
        Type: ch.Type,
        ParentID: ch.ParentID,
        RawPosition: ch.RawPosition,
        Bitrate: ch.Bitrate,
        UserLimit: ch.UserLimit
      };
      CategoryChannels[ch.ID] = { Voice: VoiceChannels[ch.ID] };
      All[ch.ID] = VoiceChannels[ch.ID];
    } else if (ch.Type == "GUILD_TEXT") {
      TextChannels[ch.ID] = {
        ID: ch.ID,
        Name: ch.Name,
        Type: ch.Type,
        ParentID: ch.ParentID,
        RawPosition: ch.RawPosition
      };
      CategoryChannels[ch.ID] = { Text: TextChannels[ch.ID] };
      All[ch.ID] = TextChannels[ch.ID];
    } else if (ch.Type == "GUILD_CATEGORY") {
      CategoryChannels[ch.ID] = {
        ID: ch.ID,
        Name: ch.Name,
        Type: ch.Type,
        RawPosition: ch.RawPosition
      };
      let Voice = {};
      let Text = {};
      for (channel of guild.ChannelList.filter((chnl) => chnl.ParentID == ch.ID)) {
        if (channel.Type == "GUILD_VOICE") {
          Voice[channel.ID] = channel;
        } else if (channel.Type == "GUILD_TEXT") {
          Voice[channel.ID] = channel;
        }
      }
      Structured[ch.ID] = {
        ID: ch.ID,
        Name: ch.Name,
        Type: ch.Type,
        RawPosition: ch.RawPosition,
        Voice: Voice,
        Text: Text
      };
      All[ch.ID] = CategoryChannels[ch.ID];
    }
  }
  this.Text = TextChannels;
  this.Voice = VoiceChannels;
  this.Category = CategoryChannels;
  this.Structured = Structured;
  this.All = All;
}

function InviteList(guild, ChList, MList) {
  this.Invites = {};
  for (inv of guild.InviteList) {
    this.Invites[inv.Code] = {
      Code: inv.Code,
      MaxAge: inv.MaxAge,
      Uses: inv.Uses,
      MaxUses: inv.MaxUses,
      InviterID: inv.InviterID,
      Inviter: MList.Members[inv.InviterID],
      ChannelID: inv.ChannelID,
      Channel: ChList.All[inv.ChannelID],
      CreatedTimestamp: inv.CreatedTimestamp,
      Created: `${timeConverterJSON(inv.CreatedTimestamp).date}.${timeConverterJSON(inv.CreatedTimestamp).month}.${timeConverterJSON(inv.CreatedTimestamp).year}`
    };
  }
}

function GuildInfo(guild) {
  guild["Created"] = `${timeConverterJSON(guild.createdAt).date}.${timeConverterJSON(guild.createdAt).month}.${timeConverterJSON(guild.createdAt).year}`;
  let RList = new RolesList(g);
  let MList = new MemberList(g, RList);
  let ChList = new ChannelList(g);
  let InvList = new InviteList(g, ChList, MList);
  let MemberCount = Object.keys(MList.Members).length;
  let BotCount = Object.keys(MList.Bots).length;

  this.ID = guild.id;
  this.Name = guild.name ? guild.name : "Unknown";
  this.MemberCount = MemberCount;
  this.BotCount = BotCount;
  this.MemberList = MList;
  this.RolesList = RList;
  this.ChannelList = ChList;
  this.InviteList = InvList;
  this.Created = guild.Created;
  this.Owner = MList.Members[guild.ownerId];
  this.ConfigList = guild.ConfigList;
}

module.exports = {
  Name: "Info",
  DescriptionShort: "This is the Info command.",
  DescriptionLong: "This is the Info command.",
  Usage: "/info",
  Category: "Moderation",
  IsOwnerDependent: true,
  Released: true,
  RequiedUserPermissions: ["Administrator"],
  RequiedBotPermissions: ["SendMessages", "ViewChannel"],

  name: "Info",
  description: "This is the Info command.",
  default: "BotOwner",
  helpdescription: "This is the Info command.",
  usage: "!info",
  helpname: "Info",
  type: "Testing",
  category: "Moderation",
  PMEnable: true,
  async run(interaction) {
    await interaction.deferReply({ ephemeral: true });
    let GuildList = {};
    let guilds = client.guilds.cache;
    await interaction.editReply({ content: `Started getting info of: PH_TYPE`, ephemeral: true });
    for (g of guilds) {
      g = await client.guilds.fetch(g[0]);
      g["ConfigList"] = GuildsConfigs[g.id].config;
      g["ChannelList"] = [];
      g["InviteList"] = [];
      for (Ch of g.channels.cache) {
        Ch = Ch[1];

        if (Ch.type == "GUILD_VOICE") {
          g["ChannelList"].push({
            ID: Ch.id,
            Name: Ch.name,
            Type: Ch.type,
            ParentID: Ch.parentId,
            RawPosition: Ch.rawPosition,
            Bitrate: Ch.bitrate,
            UserLimit: Ch.userLimit
          });
        } else if (Ch.type == "GUILD_TEXT") {
          let MessagesList = await Ch?.messages?.fetch({ limit: 100 }).catch((err) => {});
          if (MessagesList != undefined) {
            let Messages = {};
            for (m of MessagesList) {
              m = m[1];
              Messages[m.id] = {
                ID: m.id,
                AuthorID: m.author.id,
                ChannelID: m.channelId,
                Content: m.content,
                Embeds: m.embeds,
                Type: m.type,
                CreatedTimestamp: m.createdTimestamp
              };
            }
            g["ChannelList"].push({
              ID: Ch.id,
              Name: Ch.name,
              Type: Ch.type,
              ParentID: Ch.parentId,
              RawPosition: Ch.rawPosition,
              Messages
            });
          } else if (Ch.type == "GUILD_CATEGORY") {
            g["ChannelList"].push({
              ID: Ch.id,
              Name: Ch.name,
              Type: Ch.type,
              RawPosition: Ch.rawPosition
            });
          }
        }
      }
      let Invites = await g?.invites?.fetch().catch((err) => {});
      if (Invites != undefined) {
        for (Inv of Invites) {
          Inv = Inv[1];
          g["InviteList"].push({
            Code: Inv.code,
            MaxAge: Inv.maxAge,
            Uses: Inv.uses,
            MaxUses: Inv.MaxUses,
            InviterID: Inv.inviterId,
            ChannelID: Inv.channelId,
            CreatedTimestamp: Inv.createdTimestamp
          });
        }
      }

      GuildList[g.id] = new GuildInfo(g);
    }

    let JSONText = JSON.stringify(new InfoList({ GuildList, InfoHandler }), null, 4);

    let { date, month, year, hour, min } = timeConverterJSON(new Date());

    MailSender({
      attachment: {
        filename: `info_${date}_${month}_${year}_${hour}_${min}.json`,
        content: JSONText
      }
    });

    await interaction.editReply({
      content: "Done.",
      ephemeral: true
    });
  },
  async create({ commands, permissions, dmEnabled }) {
    let command = await commands?.create({
      name: this.Name.toLowerCase(),
      description: this.DescriptionShort,
      dmPermission: dmEnabled,
      defaultMemberPermissions: permissions
    });
    return command;
  }
};
