require("module-alias/register");
require("dotenv").config();
const update_database = require("@handlers/update_database")


const name = "sync"
const accessableby = ["Bulgy", "Admins", "Moderátor", "Eventer"]
const aliases = ["sc"]
const category = "Management"

module.exports.run = async (message, args) => {
    update_database();
}

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases,
    category: category
}