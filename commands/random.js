const { prefix } = require("../botconfig.json")
const random = require('random')
const find_channel_by_name = require("../handlers/channelfinder/find_channel_by_name")

const name = "random"
const description = "Příkaz pošle zprávu s náhodným číslem/čísly na základě zadaných parametrů."
const usage = `${prefix}random [minimum] [maximum] [počet čísel (výchozí počet = 1)]`
const accessableby = ["Member"]
const aliases = ["r"]



function zprava(typ, random_numbers, minimum, maximum) {
    let error_messages = [
        "Zadej hodnoty potřebné pro příkaz.",
        "Nemáš zadané minimum.",
        "Nemáš zadané maximum.",
        "Zadané minimum není číslo.",
        "Zadané maximum není číslo.",
        "Minimum nesmí být stejné jako maximum.",
        "Maximum musí být větší než minimum.",
        `Náhodné číslo z ${minimum} až ${maximum} je: ${random_numbers}`,
        `Náhodné čísla z ${minimum} až ${maximum} jsou: ${random_numbers}`
    ]

    let hodnotyout = ({ zprava: error_messages[typ], roomname: require("../botconfig/roomnames.json").botcommand })
    find_channel_by_name.run(hodnotyout)
}

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }

module.exports.run = async (message, args) => {
    let args_length = args.length
    let minimum = parseInt(args[0])
    let maximum = parseInt(args[1])
    let počet = args[2] || 1
    let random_numbers = []


    if (args_length == 0) {
        let typ = 0
        zprava(typ)
        return
    }

    if (minimum == NaN) {
        let typ = 1
        zprava(typ)
        return
    }

    if (maximum == NaN) {
        let typ = 2
        zprava(typ)
        return
    }

    if (!isNumber(minimum)) {
        let typ = 3
        zprava(typ)
        return
    }

    if (!isNumber(maximum)) {
        let typ = 4
        zprava(typ)
        return
    }

    if (minimum == maximum) {
        let typ = 5
        zprava(typ)
        return
    }

    if (minimum > maximum) {
        let typ = 6
        zprava(typ)
        return
    }

    if (počet == 1) {
        for (cisla = 0; cisla < počet; cisla++) {
            random_numbers.push(random.int(minimum, maximum))
        }

        let cisla_string = random_numbers.join(", ")

        let typ = 7
        zprava(typ, cisla_string, minimum, maximum)
    }

    else {
        for (cisla = 0; cisla < počet; cisla++) {
            random_numbers.push(random.int(minimum, maximum))
        }

        let cisla_string = random_numbers.join(", ")

        let typ = 8
        zprava(typ, cisla_string, minimum, maximum)
    }
}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}