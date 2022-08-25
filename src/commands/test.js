module.exports = {
  Name: "Test",
  DescriptionShort: "This is the test command.",
  DescriptionLong: "This is the test command.",
  Usage: "/test",
  Category: "Moderation",
  IsPremium: false,
  IsVoteDependent: false,
  IsOwnerDependent: true,
  IsAdminDependent: false,
  SupportServerOnly: false,
  PMEnable: false,
  Released: true,
  RequiedUserPermissions: ["MANAGE_GUILD"],
  RequiedBotPermissions: ["ADMINISTRATOR"],
  async create({ commands, permissions, dmEnabled }) {
    console.info(typeof permissions);
    let command = await commands?.create({
      name: this.Name.toLowerCase(),
      description: this.DescriptionShort,
      dmPermission: dmEnabled,
      defaultMemberPermissions: permissions
    });
    return command;
  },
  async run(message) {
    message.reply({
      content: "This is test."
    });
    //console.info(GuildsConfigs)
    /*let guildID = message.guildId;
    let guild = await client.guilds.fetch(guildID);
    let authorID = message.author.id;
    let member = await (
      await client.guilds.fetch(guildID)
    ).members.fetch(authorID);*/
    console.info(CommandList);
  }
};
