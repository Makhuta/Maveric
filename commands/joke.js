const { prefix } = require("../botconfig.json")
const jokes = require("../botconfig/jokes.json")
const find_channel_by_name = require("../handlers/channelfinder/find_channel_by_name");
const random = require("random")

const name = "joke"
const description = "Pošle náhodný vtip."
const usage = prefix + name
const accessableby = ["Member"]
const aliases = ["j"]

function jokeID(numofjokes) {
    return random.int(0, numofjokes - 1)
}

function send_message(zprava) {
    let hodnotyout = ({ zprava: zprava, roomname: require("../botconfig/roomnames.json").botcommand })
    find_channel_by_name.run(hodnotyout)
}

module.exports.run = async (message, args) => {
    let args_zanr = args.join(" ")
    if (args.length == 0) {
        let all_jokes = []
        jokes.forEach(zanr => {
            zanr.vtipy.forEach(vtip => {
                all_jokes.push(vtip)
            })
        })
        send_message(all_jokes[jokeID(all_jokes.length)])
    }

    else if (args == "list") {
        let list_zanru = []
        jokes.forEach(zanr => {
            list_zanru.push(zanr.zanr)
        })
        list_zanru = list_zanru.join(", ")

        send_message("Možné žánry: " + list_zanru)
    }

    else {
        let zanr_vtipu = jokes.find(zanr => zanr.zanr.toLowerCase() == args_zanr.toLowerCase())
        if(!zanr_vtipu) return send_message("Žánr vtipu není v databázi, použij **" + usage + " list**" +" pro vypsání možných žánrů.")
        send_message(zanr_vtipu.vtipy[jokeID(zanr_vtipu.vtipy.length)])
    }
}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}