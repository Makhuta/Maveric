const Discord = require("discord.js");
require("dotenv").config();
const { bot } = require('../bot');
const roomnames = require("../botconfig/roomnames.json")
const emojinames = require("../botconfig/emojinames.json")
const color = require("../colorpaletes/colors.json")
const verifymessage = require("../handlers/verification/verifymessage")
const examplereaction = require("../handlers/verification/reaction")

bot.login(process.env.BOT_TOKEN);
bot.setMaxListeners(0);
bot.on("ready", () => {
    let guild = bot.guilds.cache.first();
    let role = guild.roles.cache.find(r => r.name == "Member");
    let role_id = role.id;
    let all_users = guild.members.cache.filter(user => !user.user.bot).filter(roles => !roles._roles.includes(role_id))
    console.log(`${bot.user.username} is Ready!`);
    all_users.forEach(user => {
        user.roles.add(role).catch(console.error);
    })
    let hodnoty = ({ bot: bot, verifyroomname: roomnames.verifyroom, color: color, discord: Discord, verifyemojiname: emojinames.verifyemojiname })
    verifymessage.run(hodnoty)
})

bot.on("message", async message => {
    let hodnoty = ({ bot: bot, verifyroomname: roomnames.verifyroom, verifyemojiname: emojinames.verifyemojiname, message: message })
    examplereaction.run(hodnoty)
})