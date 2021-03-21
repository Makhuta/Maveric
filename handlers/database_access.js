require("module-alias/register");
require("dotenv").config();

const guild_database_access_cooldown = new Map();
const COOLDOWN = 500;

const constructor = {
    last_msg: 0
}

async function get_from_database(target) {
    let get_output = target ? require("@src/bot").bot.userstats.get(target.id) : require("@src/bot").bot.userstats
    return get_output
}

async function set_to_database(target, user_stats_constructor) {
    await require("@src/bot").bot.userstats.set(target.id, user_stats_constructor)
}

async function get_access(message, target) {
    let per_guild_cooldown = guild_database_access_cooldown.get(message.guild.id)

    if (!per_guild_cooldown) {
        guild_database_access_cooldown.set(message.guild.id, constructor);
        per_guild_cooldown = guild_database_access_cooldown.get(message.guild.id);
    }

    let timeout
    let cas = Date.now();

    if (per_guild_cooldown.last_msg > cas) {
        timeout = (Math.abs(cas - per_guild_cooldown.last_msg)) + COOLDOWN
    } else {
        timeout = 0
    }

    let get_data_out = new Promise(result => {
        setTimeout(async() => {
            result(await get_from_database(target));
        }, timeout)
    })

    constructor.last_msg = cas + COOLDOWN + timeout
    guild_database_access_cooldown.set(message.guild.id, constructor);

    return get_data_out
}

async function set_access(message, target, user_stats_constructor) {
    let per_guild_cooldown = guild_database_access_cooldown.get(message.guild.id)

    if (!per_guild_cooldown) {
        guild_database_access_cooldown.set(message.guild.id, constructor);
        per_guild_cooldown = guild_database_access_cooldown.get(message.guild.id);
    }

    let timeout
    let cas = Date.now();

    if (per_guild_cooldown.last_msg > cas) {
        timeout = (Math.abs(cas - per_guild_cooldown.last_msg)) + COOLDOWN
    } else {
        timeout = 0
    }
    let set_data_out = new Promise(result => {
        setTimeout(async() => {
            result(await set_to_database(target, user_stats_constructor));
        }, timeout)
    })

    constructor.last_msg = cas + COOLDOWN + timeout
    guild_database_access_cooldown.set(message.guild.id, constructor);

    return set_data_out
}

module.exports = {
    get: get_access,
    set: set_access
}