require("module-alias/register");
require("dotenv").config();
const { bot } = require("@src/bot")
const test_load = require("@events/local_database")

const name = "test"
const accessableby = ["Bulgy", "Admins"]
const aliases = ["t"]
const response = "COMMAND_ROOM_NAME";


module.exports.run = async(message, args, botconfig) => {
    message.channel.send("Tohle je test.")

    console.log(test_load.database.get(message.author.id))
}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases
}