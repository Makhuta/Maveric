const name = "createroom"
const accessableby = ["Extra V.I.P."]
const aliases = ["cr"]
const category = ["Basic", "All"]

function zprava(user, type, nameofchannel, user_language, botconfig) {
    let zprava = [user_language.HAS_BEEN_CREATED.replace("&NAME_OF_CHANNEL", nameofchannel), user_language.ALREADY_HAVE_ROOM.replace("&USERNAME", user.username)]
    user.send(zprava[type])
}

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    const guild = message.guild
    const name = `VIP ${message.author.username} ${message.author.id}`
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("CREATEROOM")

    const channel = guild.channels.cache.find(n => {
        let channel_name_array = n.name.split(" ")
        if (channel_name_array[channel_name_array.length - 1] == message.author.id) return true
    })

    if (channel == undefined) {
        guild.channels.create(name, {
                type: "voice"
            })
            .then(async channel => {
                let category = guild.channels.cache.find(c => c.name == "VIP Rooms" && c.type == "category").id;
                await channel.setParent(category)
                await channel.updateOverwrite(message.author, { VIEW_CHANNEL: true })
            })
        zprava(message.author, 0, name, user_language, botconfig)
    } else {
        zprava(message.author, 1, "", user_language, botconfig)
        return
    }

}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases,
    category: category
}