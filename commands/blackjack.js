require("module-alias/register");
require("dotenv").config();
const all_karts = require("@configs/blackjack.json")
const random = require("random")
const Discord = require("discord.js")
const signpost = require("@handlers/ranks/signpost")
const { database } = require("@events/local_database")
const xp_stats = require("@configs/xp_stats.json")

const reducer = (accumulator, currentValue) => accumulator + currentValue;

const blackjack_guild_map = new Map();
const blackjack_game_map = new Map();

const name = "blackjack"
const accessableby = ["Member"]
const aliases = ["bj", "hit", "stand"]
const response = "GAME_ROOM_NAME";

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }

function allxp(level, xp) {
    var xpecka = xp
    for (let l = 0; l < level; l++) {
        var xpToNextLevel = 5 * Math.pow(l, 2) + 50 * l + 100;
        xpecka = xpecka + xpToNextLevel;
    }
    return (xpecka)
}

function generate_cards_to_player(player_cards) {
    let cards = player_cards.card;
    let card_values = player_cards.values;

    let znak = random.int(0, 3);
    let karta = random.int(0, 12);

    let druh_karet = all_karts[znak];
    let karta_out = druh_karet.karty_znaku[karta];
    let karta_value = druh_karet.hodnoty[karta];

    if (!cards.includes(karta_out)) {
        player_cards.card.push(karta_out);
        player_cards.values.push(karta_value);
    } else {
        generate_cards_to_player(player_cards);
    }

    //console.log(karta_out)
    //console.log(cards);
    //console.log(card_values)

}

function bot_play(player_game) {
    let cards = player_game.bot_cards.card;
    let card_values = player_game.bot_cards.values;

    let znak = random.int(0, 3);
    let karta = random.int(0, 12);
    let decide_to_play = random.int(0, 1)

    let druh_karet = all_karts[znak];
    let karta_out = druh_karet.karty_znaku[karta];
    let karta_value = druh_karet.hodnoty[karta];

    if (!cards.includes(karta_out)) {
        player_game.bot_cards.card.push(karta_out);
        player_game.bot_cards.values.push(karta_value);
    } else {
        bot_play(player_game);
    }

    if (card_values.reduce(reducer) <= 15) bot_play(player_game);
    else if (card_values.reduce(reducer) < 20 && decide_to_play == 1) bot_play(player_game);

    //console.log(karta_out)
    //console.log(cards);
    //console.log(card_values.reduce(reducer));
}

function embed_message_final(embed, user_language, player_game) {
    let player_karty = player_game.cards.card.join(", ");
    let player_karty_value = player_game.cards.values.reduce(reducer);
    let bot_karty = player_game.bot_cards.card.join(", ") || ["?", "?"].join(", ");
    let bot_karty_value = player_game.bot_cards.values;
    if (bot_karty_value.length == 0) bot_karty_value = "?";
    else bot_karty_value = bot_karty_value.reduce(reducer);
    embed.setTitle("Blackjack | User: " + player_game.username)
    embed.addFields({ name: user_language.YOUR_HAND, value: player_karty + "\nTotal: **" + player_karty_value + "**", inline: true }, { name: user_language.DEALER_HAND, value: bot_karty + "\nTotal: **" + bot_karty_value + "**", inline: true }, { name: user_language.PROFIT, value: `**${player_game.sazka}** XP` })
}

function embed_message_game(embed, user_language, player_game) {
    let player_karty = player_game.cards.card.join(", ");
    let player_karty_value = player_game.cards.values.reduce(reducer);
    let bot_karty = player_game.bot_cards.card.join(", ") || ["?", "?"].join(", ");
    let bot_karty_value = player_game.bot_cards.values;
    if (bot_karty_value.length == 0) bot_karty_value = "?";
    else bot_karty_value = bot_karty_value.reduce(reducer);
    embed.setTitle("Blackjack | User: " + player_game.username)
    embed.addFields({ name: user_language.YOUR_HAND, value: player_karty + "\nTotal: **" + player_karty_value + "**", inline: true }, { name: user_language.DEALER_HAND, value: bot_karty + "\nTotal: **" + bot_karty_value + "**", inline: true }, { name: user_language.BET, value: `**${player_game.sazka}** XP` })
}

function winner_decider(user_language, player_game, is_over_max) {
    let result = "test result";
    let player_is_over = is_over_max.player;
    let bot_is_over = is_over_max.bot;
    let hodnota_player = player_game.cards.values.reduce(reducer);
    let hodnota_bot = player_game.bot_cards.values.reduce(reducer);
    //console.log(is_over_max)

    if (!player_is_over && !bot_is_over) {
        if (hodnota_player == 21 && hodnota_bot == 21) {
            result = "TIE";
        } else if (hodnota_player == 21 && hodnota_bot != 21) {
            result = "WIN";
        } else if (hodnota_player != 21 && hodnota_bot != 21) {
            if (hodnota_player > hodnota_bot) {
                result = "WIN";
            } else if (hodnota_player < hodnota_bot) {
                result = "LOSE";
            } else if (hodnota_player == hodnota_bot) {
                result = "TIE";
            }
        } else if (hodnota_player != 21 && hodnota_bot == 21) {
            result = "LOSE"
        }
    } else if (!player_is_over && bot_is_over) {
        result = "WIN";
    } else if (player_game.cards.values == [11, 11] && player_game.bot_cards.values != [11, 11]) {
        result = "WIN"
    } else if (player_game.cards.values != [11, 11] && player_game.bot_cards.values == [11, 11]) {
        result = "LOSE"
    } else if (player_game.cards.values == [11, 11] && player_game.bot_cards.values == [11, 11]) {
        result = "TIE"
    } else if (player_is_over && !bot_is_over) {
        result = "LOSE";
    } else if (player_is_over && bot_is_over) {
        if (hodnota_player < hodnota_bot) {
            result = "WIN";
        } else if (hodnota_player > hodnota_bot) {
            result = "LOSE";
        } else if (hodnota_player == hodnota_bot) {
            result = "TIE";
        }
    };



    if (result == "LOSE") player_game.sazka = -player_game.sazka;
    else if (result == "TIE") player_game.sazka = 0;




    var embed = new Discord.MessageEmbed()
    embed_message_final(embed, user_language, player_game)
    player_game.message.edit(embed);
    return result
}

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    /* pool.getConnection(async function(err, con) {
         if (err) throw err;
         con.query(`SELECT * FROM userstats WHERE id = '${message.author.id}'`, async function(err, rows) {*/
    let target = message.author
    let user_data = database.get(target.id);
    var xp = user_data.xp
    var level = user_data.level
    var tier = user_data.tier
    var resallxp = xp_stats[level].total_xp_from_zero + xp

    let triggerer = message.content.split(" ")[0].toLowerCase().slice(botconfig.filter(config => config.name == "PREFIX")[0].value.length);
    let sazka = args[0];
    let result;
    let user_language = await require("@events/language_load").languages.get(user_lang_role).get("BLACKJACK")

    if (!isNumber(sazka) && (triggerer == "blackjack" || triggerer == "bj")) return await require("@handlers/find_channel_by_name").run({ zprava: user_language.NOT_NUMBER, roomname: botconfig.find(config => config.name == response).value, message: message });

    if (resallxp < sazka) return require("@handlers/find_channel_by_name").run({ zprava: user_language.NOT_ENOUGH_XP, roomname: botconfig.find(config => config.name == response).value, message: message });

    if (sazka < 100) return require("@handlers/find_channel_by_name").run({ zprava: user_language.TOO_LOW, roomname: botconfig.find(config => config.name == response).value, message: message });

    if (sazka > 5000) return require("@handlers/find_channel_by_name").run({ zprava: user_language.TOO_HIGH, roomname: botconfig.find(config => config.name == response).value, message: message });

    let guild_id = message.channel.guild.id;
    let author = message.author;
    let player_id = author.id;

    let game_variables = { username: author.username + "#" + author.discriminator, cards: { card: [], values: [] }, bot_cards: { card: [], values: [] }, sazka: args[0], pending: false, message: "" };

    let guild_map = blackjack_guild_map.get(guild_id);

    if (!guild_map) {
        blackjack_guild_map.set(guild_id, blackjack_game_map)
        guild_map = blackjack_guild_map.get(guild_id);
    }

    let player_game = guild_map.get(player_id);

    if (!player_game && (triggerer == "blackjack" || triggerer == "bj")) {
        guild_map.set(player_id, game_variables)
        player_game = guild_map.get(player_id);
    }

    if (player_game == undefined) return

    if ((triggerer == "blackjack" || triggerer == "bj") && !player_game.pending) {
        generate_cards_to_player(player_game.cards);
        generate_cards_to_player(player_game.cards);
        player_game.pending = true;

        var embed = new Discord.MessageEmbed()
        embed_message_game(embed, user_language, player_game)
        let zprava = await require("@handlers/find_channel_by_name").run({ zprava: embed, roomname: botconfig.find(config => config.name == response).value, message: message });
        player_game.message = zprava;
        //console.log(zprava)
    } else if (triggerer == "hit" && player_game.pending) {
        generate_cards_to_player(player_game.cards);
        var embed = new Discord.MessageEmbed();
        embed_message_game(embed, user_language, player_game);
        player_game.message.edit(embed);
    } else if (triggerer == "stand" && player_game.pending) {
        if (player_game.cards.values.reduce(reducer) > 15) {
            let is_over_max = { player: false, bot: false };
            //console.log("Stand")

            bot_play(player_game);
            if (player_game.bot_cards.values.reduce(reducer) > 21 && player_game.bot_cards.values != [11, 11]) is_over_max.bot = true;

            result = winner_decider(user_language, player_game, is_over_max)
        } else return require("@handlers/find_channel_by_name").run({ zprava: user_language.LOW_CARD_VALUE, roomname: botconfig.find(config => config.name == response).value, message: message });
    }

    if (player_game.cards.values.reduce(reducer) >= 21 || player_game.cards.values == [11, 11]) {
        let is_over_max = { player: false, bot: false };
        bot_play(player_game);
        if (player_game.cards.values.reduce(reducer) > 21 && player_game.cards.values != [11, 11]) is_over_max.player = true;
        if (player_game.bot_cards.values.reduce(reducer) > 21 && player_game.bot_cards.values != [11, 11]) is_over_max.bot = true;
        //console.log(is_over_max)

        result = winner_decider(user_language, player_game, is_over_max)
    }

    if (result != undefined) {
        if (result == "WIN") {
            let win_xp = xp + Math.ceil(((player_game.sazka / 100) * 50) * (1 + (tier / 10)))
            database.get(target.id).xp = win_xp
                //let hodnoty_out = ({ type: "rankup", level: level, xp: win_xp, sql: sql, user: message.author, con: con })
            signpost.run(target.id, message, target)
                //console.log(hodnoty_out)

        } else if (result == "TIE") {

        } else if (result == "LOSE") {
            let lose_xp = xp + player_game.sazka //Sazku jsem drive změnil na opačnou

            database.get(target.id).xp = lose_xp
                //let hodnoty_out = ({ type: "rankdown", level: level, xp: lose_xp, sql: sql, user: message.author, con: con })
            signpost.run(target.id, message, target)
                //console.log(hodnoty_out)
        } else {
            //console.log("BLACKJACK RESULT ERROR");
            //console.log(result)
        }
        //console.log(result)
        guild_map.delete(player_id);
    }
    //console.log(guild_map);
    //console.log(author)

    //message.channel.send("BlackJack Test");

}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases
}