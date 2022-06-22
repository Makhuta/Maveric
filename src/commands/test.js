const { client } = require(DClientLoc);
let { join } = require("path");
let ExecuteQuery = require(join(Functions, "DBExecuter.js"));
const { Intents } = require("discord.js");

module.exports = {
  name: "Test",
  description: "This is the test command.",
  default: "BotOwner",
  helpdescription: "This is the test command.",
  usage: "!test",
  helpname: "Test",
  type: "Testing",
  PMEnable: false,
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
    console.info(GuildsConfigs)
  }
};