const { client } = require(DClientLoc);
const { join } = require("path");
const { EmbedBuilder } = require("discord.js");
const colors = require(join(ColorPaletes, "colors.json"));


module.exports = {
  Name: "SharedServers",
  DescriptionShort: "This is the shared servers command.",
  DescriptionLong: "Shows shared servers with selected User. (I need to be there)",
  Usage: "/sharedservers",
  Category: "Main",
  IsPremium: false,
  IsVoteDependent: false,
  IsOwnerDependent: false,
  IsAdminDependent: false,
  SupportServerOnly: false,
  PMEnable: false,
  Released: true,
  RequiedUserPermissions: ["SendMessages", "ViewChannel"],
  RequiedBotPermissions: ["SendMessages", "ViewChannel"],
  async create({ commands, permissions, dmEnabled }) {
    let options = [
      {
        name: "user",
        description: "Select user with which you want to see shared servers.",
        required: true,
        type: CommandTypes.User
      }
    ];
    let command = await commands?.create({
      name: this.Name.toLowerCase(),
      description: this.DescriptionShort,
      default_permission: permissions,
      dm_permission: dmEnabled,
      options
    });
    return command;
  },
  async run(interaction) {
    await interaction.deferReply({
      ephemeral: true
    });
    const { options, user } = interaction;
    let author = user;
    let requested_user = options._hoistedOptions[0].user;
    let guilds = client.guilds.cache;
    let shared_guilds = [];

    for (guild of guilds) {
      guild = guild[1];
      let members = await guild.members.cache;
      if(members.some(member => member.id == requested_user.id) && members.some(member => member.id == author.id)) {
        shared_guilds.push({
          name: guild.name,
          name_length: guild.name.length,
          id: guild.id
        });
      }
    }

    let guild_list = [];
    let number_of_guilds = shared_guilds.length;
    let description_length = 0;
    for(shared_guild of shared_guilds) {
      if(description_length < 4090){
        if(description_length >= 4000) {
          guild_list.push(`And ${number_of_guilds} more...`);
          description_length += `And ${number_of_guilds} more...`.length + 2;
          description_length = 4096;
        } else {
          guild_list.push(`[${shared_guild.name}](https://discord.com/channels/${shared_guild.id})`);
          description_length += `[${shared_guild.name}](https://discord.com/channels/${shared_guild.id})`.length + 2;
          number_of_guilds--;
        }
      }
    }


    let embed = new EmbedBuilder()
      .setColor(colors.red)
      .setTitle(requested_user.username)
      .setAuthor({ name: `Shared servers (${number_of_guilds}):` })
      .setURL(interaction.url)
      .setThumbnail(requested_user.displayAvatarURL())
      .setTimestamp()
      .setDescription(guild_list.join("\n"))
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL()
      });

    return interaction.editReply({
      embeds: [embed]
    });
  }
};
