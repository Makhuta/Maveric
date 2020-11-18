const {prefix} = require("../botconfig.json")

const name = "online"
const description = "Slouží pro ověření zda-li bot běží."
const usage = prefix + name
const accessableby = ["Bulgy", "Admins"]
const aliases = ["o"]

module.exports.run = async (message, args) => {

    message.channel.send("I am fully online sir.");

}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}