require("module-alias/register");
require("dotenv").config();
const random = require('random')

const name = "random"
const accessableby = ["Member"]
const aliases = ["r"]
const response = "COMMAND_ROOM_NAME";
const category = "Music"


function zprava(botconfig, message, user_language, typ, random_numbers, minimum, maximum) {
    let error_messages = [
        user_language.NO_ARGS,
        user_language.NO_MIN,
        user_language.NO_MAX,
        user_language.MIN_IN_NOT_NUMBER,
        user_language.MAX_IN_NOT_NUMBER,
        user_language.MIN_CANT_EQUAL_MAX,
        user_language.MAX_HUGHER_THAN_MIN,
        user_language.ONE_RANDOM.replace("&MINIMUM", minimum).replace("&MAXIMUM", maximum).replace("&RANDOM_NUMBERS", random_numbers),
        user_language.MULTIPLE_RANDOM.replace("&MINIMUM", minimum).replace("&MAXIMUM", maximum).replace("&RANDOM_NUMBERS", random_numbers)
    ]
    
    let hodnotyout = ({ zprava: error_messages[typ], roomname: botconfig.find(config => config.name == response).value, message: message })
    require("@handlers/find_channel_by_name").run(hodnotyout)
}

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("RANDOM")
    let args_length = args.length
    let minimum = parseInt(args[0])
    let maximum = parseInt(args[1])
    let počet = args[2] || 1
    let random_numbers = []


    if (args_length == 0) {
        let typ = 0
        zprava(botconfig, message, user_language, typ)
        return
    }

    if (minimum == NaN) {
        let typ = 1
        zprava(botconfig, message, user_language, typ)
        return
    }

    if (maximum == NaN) {
        let typ = 2
        zprava(botconfig, message, user_language, typ)
        return
    }

    if (!isNumber(minimum)) {
        let typ = 3
        zprava(botconfig, message, user_language, typ)
        return
    }

    if (!isNumber(maximum)) {
        let typ = 4
        zprava(botconfig, message, user_language, typ)
        return
    }

    if (minimum == maximum) {
        let typ = 5
        zprava(botconfig, message, user_language, typ)
        return
    }

    if (minimum > maximum) {
        let typ = 6
        zprava(botconfig, message, user_language, typ)
        return
    }

    if (počet == 1) {
        for (cisla = 0; cisla < počet; cisla++) {
            random_numbers.push(random.int(minimum, maximum))
        }

        let cisla_string = random_numbers.join(", ")

        let typ = 7
        zprava(botconfig, message, user_language, typ, cisla_string, minimum, maximum)
    } else {
        for (cisla = 0; cisla < počet; cisla++) {
            random_numbers.push(random.int(minimum, maximum))
        }

        let cisla_string = random_numbers.join(", ")

        let typ = 8
        zprava(botconfig, message, user_language, typ, cisla_string, minimum, maximum)
    }
}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases,
    category: category
}