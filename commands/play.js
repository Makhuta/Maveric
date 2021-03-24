require("module-alias/register");
require("dotenv").config();
const music = require("@handlers/music")

const name = "play"
const accessableby = ["Member"]
const aliases = ["p"]
const response = "MUSIC_ROOM_NAME";
const category = "Music"

const guild_music_cooldown = new Map();
const COOLDOWN = 2000;

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    let per_guild_cooldown = guild_music_cooldown.get(message.guild.id)

    const constructor = {
        last_msg: 0
    }

    if (!per_guild_cooldown) {
        guild_music_cooldown.set(message.guild.id, constructor);
        per_guild_cooldown = guild_music_cooldown.get(message.guild.id);
    }

    let timeout
    let cas = Date.now();

    if (per_guild_cooldown.last_msg > cas) {
        timeout = (Math.abs(cas - per_guild_cooldown.last_msg)) + COOLDOWN
    } else {
        timeout = 0
    }

    let cmd = name;
    setTimeout(() => {
        music(message, args, botconfig, user_lang_role, cmd);
    }, timeout)
    constructor.last_msg = cas + COOLDOWN + timeout
    guild_music_cooldown.set(message.guild.id, constructor);

    
}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases,
    category: category
}