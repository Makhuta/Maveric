const { prefix } = require("../botconfig.json")
const get_user_from_args = require("../handlers/args/get_user_from_args")
const find_channel_by_name = require("../handlers/channelfinder/find_channel_by_name")
const report_canvas = require("../handlers/report/report_canvas")
const emojinames = require("../botconfig/emojinames.json")

const name = "report"
const description = "Umožní vám nahlásit uživatele."
const usage = prefix + name + " [user] [důvod nahlášení]"
const accessableby = ["Member"]
const aliases = ["rp"]

function zprava(typ, canvas) {
    let error_messages = [
        "Nemáš zadaného člena nebo jsi ho zadal špatně.",
        "Nemáš zadaný důvod nahlášení.",
        canvas
    ]

    let hodnotyout = ({ zprava: error_messages[typ], roomname: require("../botconfig/roomnames.json").nahlaseni_uzivatele })
    find_channel_by_name.run(hodnotyout)
}

module.exports.run = async (message, args) => {
    let pretarget = message.guild.members.cache.get(get_user_from_args.run(args[0]))
    let prereason = args.slice(1).join(" ")

    if (pretarget == undefined) {
        let typ = 0
        zprava(typ)
        return
    }

    if (prereason == "") {
        let typ = 1
        zprava(typ)
        return
    }

    let first_letter = prereason[0].toUpperCase();
    let rest_of_letters = prereason.slice(1);
    let reason = first_letter + rest_of_letters

    if (reason[reason.length - 1] != ".") {
        reason = reason + "."
    }
    reason = reason.split(" ")
    let target = pretarget.user

    if (target == message.author) {
        message.author.send("Nelze nahlásít sám sebe.")
        return
    }

    let hodnotyout = ({ reason: reason, target: target, author: message.author })
    let typ = 2
    zprava(typ, await report_canvas.run(hodnotyout))
    const emoji = message.guild.emojis.cache.find(emoji => emoji.name === emojinames.verifyemojiname).id
    message.react(emoji)
}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}