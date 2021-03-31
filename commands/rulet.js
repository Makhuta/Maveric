require("module-alias/register");
require("dotenv").config();

const rulet_canvas = require("@canvases/rulet_canvas")
const colors = require("@colorpaletes/colors.json")
const ruleta_cisla = require("@configs/ruleta_cisla.json")
const array_move = require("@handlers/array_move")
const random = require("random")
const { bot } = require("@src/bot")
const signpost = require("@handlers/ranks/signpost")
const xp_stats = require("@configs/xp_stats.json");
const database_access = require("@handlers/database_access")

const name = "rulet"
const accessableby = ["Member"]
const aliases = ["rl"]
const response = "GAME_ROOM_NAME";
const category = ["Minigames", "All"]

const rulets_map = new Map();
const SAZKA = 1000;
const DELITEL = 10;
//const RULET_TIMEOUT = 300000;
const RULET_TIMEOUT = 10000;
const emoji_list = ["⚫", "🟢", "🔴"]

const rulet_result = async(message, args, botconfig, user_lang_role) => {
    let guild = message.guild
    let user_language = await require("@events/language_load").languages.get(user_lang_role).get("RULET")

    //let user_data = [];
    let user_data = Array.from((await database_access.get(message)).values());
    /*for (i = 0; i < database_data.size; i++) {
        user_data.push(database_data.keys())
    }*/

    let polovina = ruleta_cisla.length / 2
    let nahodne_cislo = random.int(0, ruleta_cisla.length - 1)
    let moved_array = await array_move.run({ array: ruleta_cisla, number_to_shift: nahodne_cislo })
    let guild_rulet = rulets_map.get(guild.id)
    let rulet_message = guild_rulet.rulet_message

    console.log(rulet_message)

    let winner_number = moved_array[0].number
    let winner_number_to_color
    let win_xp

    if (winner_number == 0) {
        winner_number_to_color = "🟢";
        win_xp = SAZKA * 14 / DELITEL;
    } else if (winner_number > 0 && winner_number < polovina + 1) {
        winner_number_to_color = "🔴";
        win_xp = SAZKA * 8 / DELITEL;
    } else if (winner_number > polovina) {
        winner_number_to_color = "⚫";
        win_xp = SAZKA * 8 / DELITEL;
    }

    let players = guild_rulet.players
    let players_array = Array.from(players.values())
    let players_results = [];
    for (i = 0; i < players_array.length; i++) {
        let all_bets = players_array[i].bets
        let win_bet = [];
        let lose_bets = [];
        for (b = 0; b < all_bets.length; b++) {
            if (all_bets[b] === winner_number_to_color) {
                win_bet.push(all_bets[b]);
            } else {
                lose_bets.push(all_bets[b]);
            }
        }
        players_results.push({
            player_id: players_array[i].player_id,
            win_bet,
            lose_bets
        })
    }

    players_results.forEach((per_player_result, index) => {
        let target = { id: per_player_result.player_id }
        let current_player = user_data.find(uzivatel => uzivatel.id == per_player_result.player_id)
        current_player.xp += (+(win_xp * per_player_result.win_bet.length) - (SAZKA * per_player_result.lose_bets.length))
        database_access.set(message, target, current_player)
    })
    hodnotyout = ({ info: "result", pocet_cisel: ruleta_cisla.length, ruleta_cisla: moved_array })
    let rulet_edited_canvas = await rulet_canvas.run(hodnotyout)
    rulet_message.delete()
    await require("@handlers/find_channel_by_name").run({ zprava: rulet_edited_canvas, roomname: botconfig.find(config => config.name == response).value, message: message });

    rulets_map.delete(guild.id)
}

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    let guild = message.guild
    let user_language = await require("@events/language_load").languages.get(user_lang_role).get("RULET")

    var constructor = {
        guild_id: guild.id,
        type: "RULET",
        players: new Map(),
        rulet_message: null
    }
    let guild_rulet = rulets_map.get(guild.id)

    if (guild_rulet) return await require("@handlers/find_channel_by_name").run({ zprava: user_language.ALREADY_PENDING, roomname: botconfig.find(config => config.name == response).value, message: message });
    else {
        rulets_map.set(guild.id, constructor)
        guild_rulet = rulets_map.get(guild.id)
    }

    let hodnotyout = ({ info: "reactions", info_color: colors.yellow, pocet_cisel: ruleta_cisla.length, ruleta_cisla: ruleta_cisla, start: true })
    var rulet_attachment = await rulet_canvas.run(hodnotyout)

    let rulet_message = await require("@handlers/find_channel_by_name").run({ zprava: rulet_attachment, roomname: botconfig.find(config => config.name == response).value, message: message });
    emoji_list.forEach(e => {
        rulet_message.react(e)
    })
    guild_rulet.rulet_message = rulet_message
    setTimeout(() => {
        rulet_result(message, args, botconfig, user_lang_role)
    }, RULET_TIMEOUT)
}

bot.on("messageReactionAdd", async(reaction, user) => {
    if (!user) return;
    if (user.bot) return;

    let reaction_name = reaction._emoji.name
    let guild = reaction.message.channel.guild
    let per_guild_rulet = rulets_map.get(guild.id)

    if (!per_guild_rulet) return
    if (per_guild_rulet.type != "RULET") return
    if (!emoji_list.includes(reaction_name)) return reaction.users.remove(user.id)

    var PLAYER_CONSTRUCTOR = {
        player_id: user.id,
        bets: []
    }

    let userstats = bot.userstats.get(user.id)
    var user_all_xp = xp_stats[userstats.level].total_xp_from_zero + userstats.xp
    let per_player_game = per_guild_rulet.players.get(user.id)

    if (!per_player_game) {
        per_guild_rulet.players.set(user.id, PLAYER_CONSTRUCTOR)
        per_player_game = per_guild_rulet.players.get(user.id)
    }

    let IF_NASOBITEL_SET = per_player_game.bets.length

    if (IF_NASOBITEL_SET == 0) IF_NASOBITEL_SET = 1

    if (IF_NASOBITEL_SET * SAZKA > user_all_xp) return reaction.users.remove(user.id)
    per_player_game.bets.push(reaction_name)
})

bot.on("messageReactionRemove", async(reaction, user) => {
    if (!user) return;
    if (user.bot) return;

    let bet_list_without_removed_reaction = [];
    let reaction_name = reaction._emoji.name
    let guild = reaction.message.channel.guild
    let per_guild_rulet = rulets_map.get(guild.id)

    if (!per_guild_rulet) return
    if (per_guild_rulet.type != "RULET") return

    let per_player_game = per_guild_rulet.players.get(user.id)

    if (!per_player_game) {
        per_guild_rulet.players.set(user.id, PLAYER_CONSTRUCTOR)
        per_player_game = per_guild_rulet.players.get(user.id)
    }

    for (let i = 0; i < per_player_game.bets.length; i++) {
        if (per_player_game.bets[i] !== reaction_name) {
            bet_list_without_removed_reaction.push(per_player_game.bets[i])
        }
    }
    per_player_game.bets = bet_list_without_removed_reaction

})



module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases,
    category: category
}