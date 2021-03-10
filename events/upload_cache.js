require("module-alias/register");
require("dotenv").config();
const update_database = require("@handlers/update_database")

const MINUTES = 10;
var SEC = MINUTES * 60;
var MILIS = SEC * 1000; 

const { bot } = require('@src/bot');


bot.on("ready", () => {
    setInterval(() => {
        update_database()
    }, MILIS)
})