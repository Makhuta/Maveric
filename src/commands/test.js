const { join } = require("path");

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
    let options = [
      {
        name: "iswelcome",
        description: "Is welcome",
        required: true,
        type: CommandTypes.Boolean
      }
    ];
    let command = await commands?.create({
      name: this.Name.toLowerCase(),
      description: this.DescriptionShort,
      dmPermission: dmEnabled,
      defaultMemberPermissions: permissions,
      options
    });
    return command;
  },
  async run(interaction) {
    await interaction.deferReply();
    let isWelcome = interaction.options.getBoolean("iswelcome");
    let member = await interaction.member.guild.members.fetch(interaction.user.id);

    var { date, month, year } = timeConverterJSON(isWelcome ? member.user.createdAt : member.joinedTimestamp);
    datum = `${date}. ${month}. ${year}`;
    //console.info(member.user);
    let attachment = await require(join(Canvases, "WelcomeCanvas.js")).run({
      //channel: GateRoom,
      target: member.user,
      stav: isWelcome ? "Welcome" : "Traitor",
      datum: datum
    });

    interaction.editReply({ files: [attachment] }).catch((error) => {
      console.info(error);
      //GuildsConfigs[guild.id].config.WELCOME_MESSAGE_ENABLED = false;
      return;
    });
    //console.info(GuildsConfigs)
    /*let guildID = message.guildId;
    let guild = await client.guilds.fetch(guildID);
    let authorID = message.author.id;
    let member = await (
      await client.guilds.fetch(guildID)
    ).members.fetch(authorID);*/
    //console.info(CommandList);
  }
};
