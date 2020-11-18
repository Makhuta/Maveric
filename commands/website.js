const { prefix } = require("../botconfig.json")
const { ip } = require("../website").web

const name = "online"
const description = "Pošle adresu webové stránky serveru."
const usage = prefix + name
const accessableby = ["Member"]
const aliases = ["w"]

module.exports.run = async (message, args) => {

    message.channel.send(ip);

}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}