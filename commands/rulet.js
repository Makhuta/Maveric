const { prefix } = require("../botconfig.json")
const rulet_canvas = require("../handlers/rulet/rulet_canvas")
const colors = require("../colorpaletes/colors.json")
const ruleta_cisla = require("../botconfig/ruleta_cisla.json")
const array_move = require("../handlers/rulet/array_move")
const random = require("random")
const { bot, con } = require("../bot")
const find_channel_by_name = require("../handlers/channelfinder/find_channel_by_name")
const signpost = require("../handlers/ranks/signpost")
const delay = require("delay")

const name = "rulet"
const description = "Spustí ruletu."
const usage = prefix + name
const accessableby = ["Member"]
const aliases = ["rl"]

function allxp(level, xp) {
    var xpecka = xp
    for (let l = 0; l < level; l++) {
        var xpToNextLevel = 5 * Math.pow(l, 2) + 50 * l + 100;
        xpecka = xpecka + xpToNextLevel;
    }
    return (xpecka)
}

module.exports.run = async(message, args) => {
    let sazka = 1000;
    let delitel = 5;
    let win_xp
    if (module.exports.rulet.pending) return

    module.exports.rulet.pending = true;







    let hodnotyout = ({ info: "reactions", info_color: colors.yellow, pocet_cisel: ruleta_cisla.length, ruleta_cisla: ruleta_cisla, start: true })
    await rulet_canvas.run(hodnotyout)

    let msg = module.exports.rulet.message
    setTimeout(async function() {
        let polovina = ruleta_cisla.length / 2
        let nahodne_cislo = random.int(0, ruleta_cisla.length - 1)
        array_move.run({ array: ruleta_cisla, number_to_shift: nahodne_cislo })
        let winner_number = ruleta_cisla[0].number
        let winner_number_to_color

        if (winner_number == 0) {
            winner_number_to_color = "🟢";
            win_xp = sazka * 14 / delitel;
        } else if (winner_number > 0 && winner_number < polovina + 1) {
            winner_number_to_color = "🔴";
            win_xp = sazka * 8 / delitel;
        } else if (winner_number > polovina) {
            winner_number_to_color = "⚫";
            win_xp = sazka * 8 / delitel;
        }

        let reactions = module.exports.rulet.message.reactions.cache
        let users = [];
        reactions.forEach(r => {
            let reacted_users = r.users.cache.filter(user => !user.bot)
            reacted_users.forEach(u => {
                users.push({ user: u, reaction: r._emoji.name })
            })
        });


        let winners = users.filter(user => user.reaction == winner_number_to_color);
        let losers = users.filter(user => user.reaction != winner_number_to_color);


        winners.forEach(w_user => {
            setTimeout(() => {
                con.query(`SELECT * FROM userstats WHERE id = '${w_user.user.id}'`, (err, rows) => {
                    if (err) throw err;

                    let target = msg.guild.members.cache.get(w_user.user.id).user

                    let sql
                    var xp = rows[0].xp
                    var level = rows[0].level
                    var resallxp = allxp(level, xp)
                    var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100

                    if (resallxp >= 1000) {
                        xp = xp + win_xp
                        let hodnoty_out = ({ type: "rankup", sql: sql, con: con, user: target, level: level, xpToNextLevel: xpToNextLevel, xp: xp, message: msg })
                        signpost.run(hodnoty_out)
                    }
                })
            }, 10000)
        })

        await delay(10000);

        let user_removed_xp = []

        losers.forEach(l_user => {
            let num_of_losing_bet = losers.filter(user => user.user.id == l_user.user.id).length
            if (user_removed_xp.includes(l_user.user.id)) return
            user_removed_xp.push(l_user.user.id)
            setTimeout(() => {
                con.query(`SELECT * FROM userstats WHERE id = '${l_user.user.id}'`, async function(err, rows) {
                    if (err) throw err;

                    let target = msg.guild.members.cache.get(l_user.user.id).user

                    let sql
                    var xp = rows[0].xp
                    var level = rows[0].level
                    var resallxp = allxp(level, xp)
                    var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100

                    if (resallxp >= 1000) {
                        xp = xp - 1000 * num_of_losing_bet
                        let hodnoty_out = ({ type: "rankdown", sql: sql, con: con, user: target, level: level, xpToNextLevel: xpToNextLevel, xp: xp, message: msg })
                        signpost.run(hodnoty_out)
                    }
                })
            }, 10000)
        })

        module.exports.rulet.message.delete();
        hodnotyout = ({ info: "result", pocet_cisel: ruleta_cisla.length, ruleta_cisla: ruleta_cisla })
        await rulet_canvas.run(hodnotyout)




        module.exports.rulet.message = "";
        module.exports.rulet.users = [];


        setTimeout(() => {
            module.exports.rulet.pending = false;
            let hodnoty_channel_out = ({ zprava: "Odměny vyplaceny.", roomname: require("../botconfig/roomnames.json").botcommand })
            find_channel_by_name.run(hodnoty_channel_out)
        }, 10000 * users.length + 1000)
    }, 300000);
}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}



module.exports.rulet = {
    pending: false,
    message: ""
}