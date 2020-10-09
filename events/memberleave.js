const { bot } = require('../bot');
const { createCanvas, loadImage, registerFont } = require("canvas");
const welcome_canvas = require("../handlers/welcome/welcome_canvas")
const { join } = require("path");
const { MessageAttachment } = require("discord.js");
const roomnames = require("../botconfig/roomnames.json");
const color = require("../colorpaletes/colors.json")
registerFont("./fonts/Square.ttf", { family: "test" })

bot.on("guildMemberRemove", (member) => {
    bot.channels.fetch(bot.channels.cache.find(c => c.name === roomnames.gateroom).id)
        .then(channel => {
            var d = new Date(member.joinedTimestamp).toLocaleDateString('en').split("/")
            var datum = [d[1], d[0], d[2]].join(". ")
            const msg = bot.channels.cache.get(channel.id)
            let hodnoty = ({ createCanvas: createCanvas, message: msg, join: join, MessageAttachment: MessageAttachment, loadImage: loadImage, color: color, target: member.user, stav: "Traitor", datum: datum })
            welcome_canvas.run(hodnoty)


        })
})