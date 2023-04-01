const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const { join } = require("path");
const colors = require(join(ColorPaletes, "colors.json"));
const { client } = require(DClientLoc);

var SubReddits = ["dankmemes", "meme", "memes"];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = {
  Name: "Meme",
  DescriptionShort: "This is the meme command.",
  DescriptionLong: "This command will response with meme from chosen subreddit if subreddit was not chosen it will pick randomly.",
  Usage: "/meme (subredit)",
  PMEnable: true,
  Released: true,
  RequiedUserPermissions: ["SendMessages", "ViewChannel"],
  RequiedBotPermissions: ["SendMessages", "ViewChannel"],
  async create({ commands, permissions, dmEnabled }) {
    let choices = [];
    for (SubRedditID in SubReddits) {
      let SubReddit = SubReddits[SubRedditID];
      choices.push({
        name: SubReddit.slice(0, 1).toUpperCase() + SubReddit.slice(1, SubReddit.length),
        value: SubReddit
      });
    }
    let options = [
      {
        name: "reddit",
        description: "Name of reddit you want to get meme from",
        required: false,
        type: CommandTypes.String,
        choices: choices
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
    await interaction.deferReply();
    const { options } = interaction;
    let RequestedReddit = options.getString("reddit");
    let RequestIsUndefined = RequestedReddit == null;

    if (RequestIsUndefined) {
      RequestedReddit = SubReddits[getRandomInt(SubReddits.length - 1)];
    }

    let url = await fetch(`https://www.reddit.com/r/${RequestedReddit}/top/.json?t=month`);
    let random = await url.json();
    let RandomCh = random.data.children;
    let MemeData = RandomCh[getRandomInt(RandomCh.length - 1)].data;

    var embed = new EmbedBuilder()
      .setTitle(MemeData.title.slice(0, 255))
      .setURL(`https://www.reddit.com${MemeData.permalink}`)
      .setImage(MemeData.url)
      .setColor(colors.red)
      .setTimestamp()
      .setFooter({
        text: `⬆️${MemeData.ups}`,
        iconURL: client.user.displayAvatarURL()
      })
      .setAuthor({
        name: MemeData.subreddit_name_prefixed,
        iconURL: "https://b.thumbs.redditmedia.com/8cMVsK9DKU-HJSM2WEG9mAGHIgd8-cEsnpJNJlB5NPw.png",
        url: `https://www.reddit.com${MemeData.permalink}`
      });

    interaction.editReply({
      embeds: [embed]
    });
  }
};
