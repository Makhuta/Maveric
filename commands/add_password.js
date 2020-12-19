const { prefix } = require("../botconfig.json")
const passwords = require("../events/local_database").passwords
const { bot, con } = require('../bot');
const generator = require("generate-password")

const name = "addpassword"
const description = "Přidělí heslo členovi."
const usage = prefix + name + " [user] [tier]"
const accessableby = ["Bulgy", "Admins"]
const aliases = ["ap"]

async function reload_passwords() {
    con.query(`SELECT * FROM passwords`, async(err, rows) => {
        if (err) throw err


        passwords.rows = rows
    })
}

async function add_to_passwords(target_id, target_username, heslo, tier, target, message) {
    con.query(`SELECT * FROM passwords`, async(err, rows) => {
        if (err) throw err
        let sql

        let id_list = []
        rows.forEach(row => {
            id_list.push(row.user_id)
        })

        let target_exist = id_list.includes(target_id)

        if (target_exist) return

        sql = `INSERT INTO passwords (user_id, username, password, tier) VALUES ('${target_id}', '${target_username}', '${heslo}', '${tier}')`
        con.query(sql)

        target.send("Tvé heslo bylo úspěšně vygenerováno.\nTvé heslo je: " + heslo)

        message.author.send(`Heslo pro uživatele ${target_username} bylo vygenerováno.\nTier pro tohoto uživatele je: ${tier}`)

    })
}

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }

module.exports.run = async(message, args) => {
    let user_id = args[0].slice(3, args[0].length - 1)
    let target = message.guild.members.cache.get(user_id)
    let radky = passwords.rows

    if (target == undefined) return

    target = target.user

    let index_search = []
    let id_list = []
    radky.forEach(row => {
        index_search.push({ id: row.user_id, password: row.password })
        id_list.push(row.user_id)
    })

    let target_exist = id_list.includes(target.id)

    if (target_exist) return

    var tier = args[1]

    if (!isNumber(tier)) return

    var target_username = target.username
    var target_id = target.id
    var heslo = generator.generate({
        length: 10,
        numbers: false
    });

    await add_to_passwords(target_id, target_username, heslo, tier, target, message)


    await reload_passwords()
}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}