require("module-alias/register");
require("dotenv").config();
const music = require("@handlers/music")

const name = "leave"
const accessableby = ["Member"]
const aliases = ["l"]
const response = "MUSIC_ROOM_NAME";

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    let cmd = name;
    music(message, args, botconfig, user_lang_role, cmd);
}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases
}