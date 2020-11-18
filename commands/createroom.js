const { prefix } = require("../botconfig.json")
const find_channel_by_name = require("../handlers/channelfinder/find_channel_by_name")

const name = "createroom"
const description = "Vytvoří vlastní soukromou room."
const usage = `${prefix}createroom`
const accessableby = ["Extra V.I.P."]
const aliases = ["cr"]

function zprava(user, type, nameofchannel) {
    let zprava = [`Tvá Room byla vytvořena pod názvem: ${nameofchannel}`, `${user.username} již máš svou Room.`]
    user.send(zprava[type])
}

module.exports.run = async (message) => {
    const guild = message.guild
    const name = `VIP ${message.author.username}`

    const channel = guild.channels.cache.find(n => n.name === name)

    if (channel == undefined) {
        guild.channels.create(name, {
            type: "voice"
        })
            .then(async channel => {
                let category = guild.channels.cache.find(c => c.name == "VIP Rooms" && c.type == "category").id;
                await channel.setParent(category)
                await channel.updateOverwrite(message.author, { VIEW_CHANNEL: true })
            })
        zprava(message.author, 0, name)
    }

    else {
        zprava(message.author, 1)
        return
    }

}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}