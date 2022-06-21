const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const { join } = require("path");
const colors = require(join(ColorPaletes, "colors.json"));
const { client } = require(DClientLoc);
const randomNum = require("random");

var SubReddits = ["dankmemes", "meme", "memes"];

module.exports = {
  name: "Meme",
  description: "This is the meme command.",
  default: true,
  helpdescription: "This is the meme command.",
  usage: "/meme",
  helpname: "Meme",
  type: "Global",
  PMEnable: true,
  async run(interaction) {
    await interaction.deferReply();
    const { options } = interaction;
    let RequestedReddit = options.getString("reddit");
    let RequestIsUndefined = RequestedReddit == null;

    if (RequestIsUndefined) {
      RequestedReddit = SubReddits[randomNum.int(0, SubReddits.length - 1)];
    }

    let url = await fetch(
      `https://www.reddit.com/r/${RequestedReddit}/top/.json?t=month`
    );
    let random = await url.json();
    let RandomCh = random.data.children;
    let MemeData = RandomCh[randomNum.int(0, RandomCh.length - 1)].data;

    var embed = new MessageEmbed()
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
        iconURL:
          "https://b.thumbs.redditmedia.com/8cMVsK9DKU-HJSM2WEG9mAGHIgd8-cEsnpJNJlB5NPw.png",
        url: `https://www.reddit.com${MemeData.permalink}`
      });

    interaction.editReply({
      embeds: [embed]
    });
  },
  async create({ commands, permissions }) {
    let choices = [];
    for (SubRedditID in SubReddits) {
      let SubReddit = SubReddits[SubRedditID];
      choices.push({
        name:
          SubReddit.slice(0, 1).toUpperCase() +
          SubReddit.slice(1, SubReddit.length),
        value: SubReddit
      });
    }
    let options = [
      {
        name: "reddit",
        description: "Name of reddit you want to get meme from",
        required: false,
        type: CommandTypes.STRING,
        choices: choices
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
