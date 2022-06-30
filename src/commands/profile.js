const { join } = require("path");
const { client } = require(DClientLoc);
const { MessageEmbed } = require("discord.js");

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

async function GetEmbedFields({ RequestedUser, IsDM, Guild, interaction }) {
  return new Promise(async (resolve, reject) => {
    let PrivateFields;
    let Voted = `[Not yet](https://top.gg/bot/${process.env.TOPGGID}/vote)`;
    if (RequestedUser.voted) {
      Voted = "✅";
    }
    let EmbedFields = [
      {
        name: "Voted",
        value: Voted,
        inline: true
      },
      {
        name: "Discriminator",
        value: `#${RequestedUser.discriminator}`,
        inline: true
      },
      {
        name: "Joined Discord",
        value: RequestedUser.createdDate,
        inline: true
      }
    ];
    if (IsDM) {
      PrivateFields = [];

      resolve([...EmbedFields, ...PrivateFields]);
    } else {
      let OtherRoles = [];
      let RolesWithoutHighest = RequestedUser.allRoles
        .filter((role) => role.rawPosition != RequestedUser.highestRole.rawPosition)
        .sort((a, b) => parseInt(b.rawPosition) - parseInt(a.rawPosition));
      for (role of RolesWithoutHighest) {
        role = role[1];
        OtherRoles.push(role.name);
      }

      if(OtherRoles.length < 1) {
        OtherRoles = `${RequestedUser.username} has no other roles`
      } else {
        OtherRoles = OtherRoles.join(", ")
      }

      PrivateFields = [
        {
          name: "Member since:",
          value: RequestedUser.joinedDate,
          inline: true
        },
        {
          name: "Highest role:",
          value: `[\`${RequestedUser.highestRole.name}\`](${interaction.url} "Other Roles: ${OtherRoles}")`,
          inline: true
        },
        {
          name: "Owner:",
          value: RequestedUser.owner,
          inline: true
        }
      ];

      resolve([...EmbedFields, ...PrivateFields]);
    }
  });
}

module.exports = {
  name: "Profile",
  description: "This is the profile command.",
  default: true,
  helpdescription: "Show you your profile information",
  usage: "/profile",
  helpname: "Profile",
  type: "Global",
  category: "Main",
  PMEnable: true,
  async run(interaction) {
    const { options, member, user, guildId } = interaction;
    let Request = options.getUser("user");
    let RequestIsUndefined = Request == null || Request == undefined;
    let IsDM = interaction.guildId == null;

    if (IsDM) {
      interaction["url"] = `https://discord.com/channels/@me`;
    } else {
      interaction["url"] = `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`;
    }

    let RequestedUser = {
      id: Request?.id ? Request.id : user.id,
      discriminator: Request?.discriminator ? Request.discriminator : user.discriminator,
      username: Request?.username ? Request.username : user.username,
      avatar: Request?.avatar ? Request.avatar : user.avatar,
      banner: Request?.banner ? Request.banner : user.banner,
      bot: Request?.bot ? Request.bot : user.bot,
      owner: (member?.guild?.ownerId == (Request?.id ? Request.id : user.id)).toString().replace("true", "✅").replace("false", "❌"),
      avatarURL: Request?.displayAvatarURL() ? Request.displayAvatarURL() : user.displayAvatarURL(),
      voted: await TopGGApi.hasVoted(Request?.id ? Request.id : user.id),
      createdTimestamp: Request?.createdAt ? Request.createdAt : user.createdAt,
      createdDate: timeConverter(Request?.createdAt ? Request.createdAt : user.createdAt),
      joinedTimestamp: member?.guild?.members?.cache?.get(Request?.id ? Request.id : user.id)?.joinedTimestamp
        ? member.guild.members.cache?.get(Request?.id ? Request.id : user.id).joinedTimestamp
        : undefined,
      joinedDate: timeConverter(
        member?.guild?.members?.cache?.get(Request?.id ? Request.id : user.id)?.joinedTimestamp
          ? member.guild.members.cache?.get(Request?.id ? Request.id : user.id).joinedTimestamp
          : undefined
      ),
      allRoles: member?.guild?.members?.cache?.get(Request?.id ? Request.id : user.id)?.roles?.cache
        ? member.guild.members.cache.get(Request?.id ? Request.id : user.id).roles.cache.filter((role) => role.name != "@everyone")
        : undefined,
      highestRole: member?.guild?.members?.cache?.get(Request?.id ? Request.id : user.id)?.roles?.highest
        ? member.guild.members.cache.get(Request?.id ? Request.id : user.id).roles.highest
        : undefined
    };

    let EmbedFields = await GetEmbedFields({
      RequestedUser,
      IsDM,
      Guild: member?.guild,
      interaction
    });

    let embed = new MessageEmbed()
      .setColor("RANDOM")
      .setAuthor({ name: "Profile" })
      .setTitle(RequestedUser.username)
      .setURL(interaction.url)
      .setThumbnail(RequestedUser.avatarURL)
      .addFields(EmbedFields)
      .addField(`ㅤ\nIf you didn't vote consider voting for me to unlock more features.`, `[TOP.GG](https://top.gg/bot/${process.env.TOPGGID}/vote)`)

      .setTimestamp()
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL()
      });

    interaction.reply({
      embeds: [embed]
    });
  },
  async create({ commands, permissions }) {
    let options = [
      {
        name: "user",
        description: "Select user of which you want to see profile.",
        required: false,
        type: CommandTypes.USER
      }
    ];
    let command = await commands?.create({
      name: this.name.toLowerCase(),
      description: this.description,
      defaultPermission: permissions,
      options
    });
    return command;
  }
};
