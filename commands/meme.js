require("module-alias/register");
require("dotenv").config();
const { MessageEmbed } = require("discord.js");
const api = require("imageapi.js");
const subreddits = require("@configs/meme_sites.json")

const name = "meme"
const accessableby = ["Member"]
const aliases = ["m"]
const response = "COMMAND_ROOM_NAME";
const category = ["Fun", "All"]


module.exports.run = async(message, args, botconfig, user_lang_role) => {
    let subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
    let img = await api(subreddit);
    const Embed = new MessageEmbed()
        .setTitle(`A meme from r/${subreddit}`)
        .setURL(`https://reddit.com/r/${subreddit}`)
        .setColor("RANDOM")
        .setImage(img);

    require("@handlers/find_channel_by_name").run({ zprava: Embed, roomname: botconfig.find(config => config.name == response).value, message: message });
}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases,
    category: category
}