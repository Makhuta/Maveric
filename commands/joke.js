const { prefix } = require("../botconfig.json")
const random = require("random")
const fs = require("fs");
const path = require("path")
const Discord = require("discord.js");
const color = require("../colorpaletes/colors.json")

const name = "joke"
const description = "Pošle náhodný vtip."
const usage = prefix + name
const accessableby = ["Member"]
const aliases = ["j"]

const vtipy_slozka = path.join(__dirname, "../botconfig", "vtipy")

function jokeID(numofjokes) {
    return random.int(0, numofjokes - 1)
}

function embed_zprava(zanr, zprava) {
    var embed = new Discord.MessageEmbed()
        .setAuthor(zanr)
        .setDescription(zprava)
        .setColor(color.red)
    return embed
}

function send_message(verze, zprava, message_author, zanr) {
    if (verze == 1) {
        message_author.send(embed_zprava(zanr, zprava))
    }
    else {
        message_author.send(zprava)
    }
}

module.exports.run = async (message, args) => {
    let message_author = message.author
    let vtipy_list = fs.readdirSync(vtipy_slozka)
    let jokes = []
    vtipy_list.forEach(zanr_vtipu => {
        jokes.push(require(vtipy_slozka + "/" + zanr_vtipu))
    })

    let args_zanr = args.join(" ")
    if (args.length == 0) {
        let all_jokes = []
        jokes.forEach(zanr => {
            zanr.vtipy.forEach(vtip => {
                all_jokes.push({ zanr: zanr.zanr, vtip: vtip })
            })
        })
        let vtip_out = all_jokes[jokeID(all_jokes.length)]
        send_message(1, vtip_out.vtip, message_author, vtip_out.zanr)
    }

    else if (args == "list") {
        let list_zanru = []
        jokes.forEach(zanr => {
            list_zanru.push(zanr.zanr)
        })
        list_zanru = list_zanru.join(", ")

        send_message(0, "Možné žánry: " + list_zanru, message_author)
    }

    else {
        let zanr_vtipu = jokes.find(zanr => zanr.zanr.toLowerCase() == args_zanr.toLowerCase())
        if (!zanr_vtipu) return send_message(0, "Žánr vtipu není v databázi, použij **" + usage + " list**" + " pro vypsání možných žánrů.", message_author)
        send_message(1, zanr_vtipu.vtipy[jokeID(zanr_vtipu.vtipy.length)], message_author, zanr_vtipu.zanr)
    }
}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}