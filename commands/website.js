const { prefix } = require("../botconfig.json")
const { ip } = require("../website").web
const find_channel_by_name = require("../handlers/channelfinder/find_channel_by_name");

const name = "website"
const description = "Pošle adresu webové stránky serveru."
const usage = prefix + name
const accessableby = ["Member"]
const aliases = ["w"]

module.exports.run = async (message, args) => {


    let hodnotyout = ({ zprava: ip, roomname: require("../botconfig/roomnames.json").botcommand })
    find_channel_by_name.run(hodnotyout)

}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}