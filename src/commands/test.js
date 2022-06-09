const { client } = require(DClientLoc);

module.exports = {
  name: "Test",
  description: "This is the test command.",
  default: "BotOwner",
  helpdescription: "This is the test command.",
  usage: "/test",
  helpname: "Test",
  type: "Testing",
  async run(message) {
    message.reply({
      content: "This is test."
    });
    //console.info(GuildsConfigs)
    let guildID = message.guildId;
    let guild = await client.guilds.fetch(guildID);
    let authorID = message.author.id;
    let member = await (
      await client.guilds.fetch(guildID)
    ).members.fetch(authorID);
    client.emit("guildDelete", guild);
  },
  create({ commands }) {
    let command = commands?.create({
      name: this.name.toLowerCase(),
      description: this.description,
      defaultPermission: false,
      code: this.run
    });
    return command;
  }
};
