const Discord = require("discord.js");
const botconfig = require("../botconfig.json")
const color = require("../colors.json")

const name = "test"
const description = "Tento příkaz je jen pro budoucí testování bota."
const usage = `${botconfig.prefix}test`
const accessableby = "Bulgy, Admins"
const accessableby = ["Bulgy", "Admins"]
const aliases = ["t"]

module.exports.run = async (bot, message, args) => {
    const prikaz = message.content
    console.log(prikaz.slice(botconfig.prefix.length))
       /* let welcomemsg = new Discord.MessageEmbed()
            .setTitle(`Vítej ${message.author.username}`)
            .setColor(color.red)
            .setDescription(`
                **Nový člen smečky**
                Právě se k nám přidal ${message.author.username}
                `)
                .setFooter(bot.user.username)
    */
        message.channel.send("test");


    /*bot.channels.fetch(bot.channels.cache.find(c => c.name === botconfig.gateroom).id)
        .then(channel => {
            //console.log(message.author.avatarURL)
            var d = "nejake datum (je funkcni)"
            var url = message.author.displayAvatarURL({format: "png", size: 512})
            var boturl = bot.user.displayAvatarURL({format: "png", size: 512})

            const msg = bot.channels.cache.get(channel.id)
            console.log(url)
            let welcomemsg = new Discord.MessageEmbed()
                .setTitle(`Vítej ${message.author.username}`)
                .setColor(color.red)
                .setDescription(`
            **Nový člen smečky**
            Právě se k nám přidal ${message.author.username}
            Discord účet si založil: ${d}
            `)
                //.setImage(url)
                .setThumbnail(url)
                .setTimestamp()
                .setFooter(bot.user.username, boturl)


            msg.send({ embed: welcomemsg });
        })

    /*var member = message.mentions.members.first();
    let embed = new Discord.MessageEmbed()
    //var url = getavataruser(member)
    //console.log(url)
        embed.setImage(message.author.displayAvatarURL())
        .setColor('#275BF0')
    message.channel.send(embed)*/

}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}