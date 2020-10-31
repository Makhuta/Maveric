const { con } = require('../bot')
const { prefix } = require("../botconfig.json")
const random = require('random')
const find_channel_by_name = require("../handlers/channelfinder/find_channel_by_name");
const lower_or_higher_canvas = require("../handlers/lower_or_higher/lower_or_higher_canvas")
const lower_or_higher_reaction_canvas = require("../handlers/lower_or_higher/lower_or_higher_reaction_canvas")
const emojinames = require("../botconfig/emojinames.json")
const signpost = require("../handlers/ranks/signpost")

const name = "lowerorhigher"
const description = ""
const usage = prefix + name + " [@user] [číslo (2-99)] [výše sázky]"
const accessableby = ["Member"]
const aliases = ["loh"]

function error_message(typ, hodnota_typ, minuty) {
    let zprava = [
        "Musíš označit toho s kým chceš hrát.",
        "Zkontroluj si zda-li máš správné pořadí parametrů.",
        "Nemůžeš hrát sám se sebou.",
        "Nemůžeš hrát s Botem.",
        `Zadaná hodnota ${hodnota_typ} není číslo nebo není zadaná.`,
        "Číslo nesmí být menší než 2.",
        "Číslo nesmí být větší než 99.",
        "Můžeš vsadit miniálně 200 XP.",
        "Můžeš vsadit maxiálně 5000 XP.",
        "Nemáš dostatek XP pro hru.",
        "Protivník nemá dostatek XP pro hru.",
        `Další hru můžeš mít za ${minuty} minut.`,
        "Právě probíhá jiná hra."
    ]
    let hodnotyout = ({ zprava: zprava[typ], roomname: require("../botconfig/roomnames.json").botcommand })
    find_channel_by_name.run(hodnotyout)
}

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }

function allxp(level, xp) {
    var xpecka = xp
    for (let l = 0; l < level; l++) {
        var xpToNextLevel = 5 * Math.pow(l, 2) + 50 * l + 100;
        xpecka = xpecka + xpToNextLevel;
    }
    return (xpecka)
}

function randomnumber() {
    return random.int(1, 100)
}

module.exports.run = async (message, args) => {
    let target = message.mentions.users.first()
    let author = message.author
    let cislo_sazka = args[1]
    let sazka_xp = args[2]
    let stav_her = lower_or_higher_reaction_canvas.loh.stav_her


    //Podmínky 1
    {

        if (target == undefined) {
            let typ = 0
            error_message(typ)
            return
        }

        let target_args = args[0].slice(3, args[0].length - 1)

        if (target.id != target_args) {
            let typ = 1
            error_message(typ)
            return
        }

        if (target == author) {
            let typ = 2
            error_message(typ)
            return
        }

        if (target.bot) {
            let typ = 3
            error_message(typ)
            return
        }

        if (!isNumber(cislo_sazka)) {
            let typ = 4
            let hodnota_typ = "pozičního čísla"
            error_message(typ, hodnota_typ)
            return
        }

        if (cislo_sazka < 2) {
            let typ = 5
            error_message(typ)
            return
        }

        if (cislo_sazka > 99) {
            let typ = 6
            error_message(typ)
            return
        }

        if (!isNumber(sazka_xp)) {
            let typ = 4
            let hodnota_typ = "XP"
            error_message(typ, hodnota_typ)
            return
        }

        if (sazka_xp < 200) {
            let typ = 7
            error_message(typ)
            return
        }

        if (sazka_xp > 5000) {
            let typ = 8
            error_message(typ)
            return
        }

        if (Date.now() - stav_her < 60000) {
            let typ = 12
            error_message(typ)
            return
        }

    }

    con.query(`SELECT * FROM userstats WHERE id = '${author.id}'`, (err_author, rows_author) => {
        if (err_author) throw err_author;

        con.query(`SELECT * FROM userstats WHERE id = '${target.id}'`, async (err_target, rows_target) => {
            if (err_target) throw err_target;

            let sql
            var xp_author
            var level_author
            var xp_target
            var level_target
            var last_loh
            var resallxp_author
            var resallxp_target
            var nahodnecislo = randomnumber()
            var cas = Date.now()
            var min_time = 600000

            if (rows_author.length < 1) {
                sql = `INSERT INTO userstats (id, xp) VALUES ('${author.id}', 0)`
                con.query(sql)
            }
            else {
                xp_author = rows_author[0].xp
                level_author = rows_author[0].level
                last_loh = rows_author[0].last_loh
                resallxp_author = allxp(level_author, xp_author)
            }

            //Podmínky 2
            {

                if (rows_target.length < 1) {
                    sql = `INSERT INTO userstats (id, xp) VALUES ('${target.id}', 0)`
                    con.query(sql)
                }
                else {
                    xp_target = rows_target[0].xp
                    level_target = rows_target[0].level
                    resallxp_target = allxp(level_target, xp_target)
                }

                if (sazka_xp > resallxp_author) {
                    let typ = 9
                    error_message(typ)
                    return
                }

                if (sazka_xp > resallxp_target) {
                    let typ = 10
                    error_message(typ)
                    return
                }

                if (cas - last_loh < min_time) {
                    var milisekundy = (parseInt(last_loh) + min_time) - cas
                    var minuty = Math.ceil(milisekundy / 60000);
                    let typ = 11
                    error_message(typ, "", minuty)
                    return
                }

            }

            let hodnoty = ({ cislo_sazka: cislo_sazka, author: author, target: target, sazka_xp: sazka_xp, message: message, nahodnecislo: nahodnecislo })
            let vysledek = await lower_or_higher_reaction_canvas.run(hodnoty)





            sql = `UPDATE userstats SET last_loh = ${cas} WHERE id = '${author.id}'`;
            con.query(sql)
        })
    })
}

module.exports.result = async () => {
    let result_array = [[0, 1], [1, 0]]
    let result
    let result_canvas
    let stav
    let emoji = lower_or_higher_reaction_canvas.loh.reakce
    let cislo_sazka = lower_or_higher_reaction_canvas.loh.cislo_sazka
    let sazka_xp = parseInt(lower_or_higher_reaction_canvas.loh.sazka_xp)
    let nahodnecislo = lower_or_higher_reaction_canvas.loh.nahodnecislo
    let target = lower_or_higher_reaction_canvas.loh.target
    let author = lower_or_higher_reaction_canvas.loh.author
    let sql

    if (emoji == emojinames.up) {
        stav = ({ target: "higher" })
    }
    else if (emoji == emojinames.down) {
        stav = ({ target: "lower" })
    }

    if (nahodnecislo < cislo_sazka) {
        if (stav.target == "lower") {
            //Target Wins
            result = result_array[1]
            result_canvas = result_array[1]
            //console.log("lower1")
        }
        else {
            //Target Lose
            result = result_array[0]
            result_canvas = result_array[0]
            //console.log("higher1")
        }
    }

    else {
        if (stav.target == "higher") {
            //Target Wins
            result = result_array[1]
            result_canvas = result_array[0]
            //console.log("higher2")
        }
        else {
            //Target Lose
            result = result_array[0]
            result_canvas = result_array[1]
            //console.log("lower2")
        }
    }


    con.query(`SELECT * FROM userstats WHERE id = '${author.id}'`, (err_author, rows_author) => {
        if (err_author) throw err_author;

        con.query(`SELECT * FROM userstats WHERE id = '${target.id}'`, async (err_target, rows_target) => {
            if (err_target) throw err_target;

            let xp_author = rows_author[0].xp
            let level_author = rows_author[0].level

            let xp_target = rows_target[0].xp
            let level_target = rows_target[0].level



            if (result[0] == 1) {
                xp_target = xp_target + sazka_xp
                xp_author = xp_author - sazka_xp
                let hodnoty1 = ({ type: "rankup", level: level_target, xp: xp_target, sql: sql, user: target, con: con })
                await signpost.run(hodnoty1)

                let hodnoty2 = ({ type: "rankdown", level: level_author, xp: xp_author, sql: sql, user: author, con: con })
                await signpost.run(hodnoty2)

                //console.log("WIN")
            }

            else {
                xp_target = xp_target - sazka_xp
                xp_author = xp_author + sazka_xp
                let hodnoty1 = ({ type: "rankdown", level: level_target, xp: xp_target, sql: sql, user: target, con: con })
                await signpost.run(hodnoty1)

                let hodnoty2 = ({ type: "rankup", level: level_author, xp: xp_author, sql: sql, user: author, con: con })
                await signpost.run(hodnoty2)

                //console.log("lose")
            }



        })
    })









    //console.log("Sazka: " + cislo_sazka + " Nahodné: " + nahodnecislo)


    //console.log(result_canvas)

    let hodnoty = ({ result: result_canvas })
    lower_or_higher_canvas.run(hodnoty)
}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}