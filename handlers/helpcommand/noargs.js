const find_channel_by_name = require("../channelfinder/find_channel_by_name")

module.exports = {
    run: (hodnoty) => {
        let Discord = hodnoty.discord
        let fs = hodnoty.fs
        let color = hodnoty.color
        let message = hodnoty.message
        fs.readdir("./commands/", (err, files) => {

            var embed = new Discord.MessageEmbed()
            embed.setAuthor(`Seznam použitelných příkazů:`)
            let seznamjs = files.join(', ')
            for (var i = 0; i <= files.length; i++) {
                seznamjs = seznamjs.replace('.js', '')
            }

            embed.setDescription(seznamjs)
            embed.addFields({ name: 'Prefix', value: hodnoty.prefix, inline: true },
                { name: 'Dotazy', value: 'Pro konkrétnější dotazy se obraťte na Admin team.\nPro seznam Admin teamu použijte příkaz ' + hodnoty.prefix + 'admins' })
            embed.setColor(color.aqua)

            let hodnotyout = ({ zprava: embed, roomname: require("../../botconfig/roomnames.json").botcommand })
            find_channel_by_name.run(hodnotyout)
        })
    }
}