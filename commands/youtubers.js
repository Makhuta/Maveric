const { prefix } = require("../botconfig.json")
const youtubers_database = require("../events/local_database").youtubers
const find_channel_by_name = require("../handlers/channelfinder/find_channel_by_name")
const color = require("../colorpaletes/colors.json")
const Discord = require("discord.js")

const name = "youtubers"
const description = "Vypíše seznam Youtuberů na serveru."
const usage = prefix + name
const accessableby = ["Member"]
const aliases = ["yt"]

module.exports.run = async(message, args) => {
    let rows = youtubers_database.rows
    let youtubers = []

    rows.forEach(row => {
        youtubers.push({ name: row.name, channel_name: row.channel_name, channel: row.channel_url })
    });

    let embed = new Discord.MessageEmbed()
        .setTitle("Youtubeři:")
        .setColor(color.red)

    youtubers.forEach(youtuber => {
        embed.addFields({ name: `**${youtuber.name}**`, value: `[${youtuber.channel_name}](${youtuber.channel})` })
    })


    let hodnoty = ({ zprava: embed, roomname: require("../botconfig/roomnames.json").botcommand })
    find_channel_by_name.run(hodnoty)
}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}