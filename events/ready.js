const Discord = require("discord.js");
require("dotenv").config();
const { bot } = require('../bot');
const roomnames = require("../botconfig/roomnames.json")
const emojinames = require("../botconfig/emojinames.json")
const color = require("../colorpaletes/colors.json")
const verifymessage = require("../handlers/verification/verifymessage")
const examplereaction = require("../handlers/verification/reaction")

bot.login(process.env.BOT_TOKEN);
bot.on("ready", () => {
    console.log(`${bot.user.username} is Ready!`);
    let hodnoty = ({ bot: bot, verifyroomname: roomnames.verifyroom, color: color, discord: Discord, verifyemojiname: emojinames.verifyemojiname })
    verifymessage.run(hodnoty)
})

bot.on("message", async message => {
    let hodnoty = ({ bot: bot, verifyroomname: roomnames.verifyroom, verifyemojiname: emojinames.verifyemojiname, message: message })
    examplereaction.run(hodnoty)
})