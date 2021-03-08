require("module-alias/register");
require("dotenv").config();
const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage, Canvas } = require("canvas");
const { join } = require("path");
const colors = require("@colorpaletes/colors.json")
const find_channel_by_name = require("@handlers/find_channel_by_name")
const rulet = require("@commands/rulet")

function drawTextAlongArc(context, str, centerX, centerY, radius, angle) {
    context.save();
    context.translate(centerX, centerY);
    context.lineWidth = 1;
    context.font = "bold 30pt Arial";
    context.textAlign = "center";
    context.rotate(-1 * angle / 2 - ((Math.PI / 2) + Math.PI / str.length));
    context.rotate(-1 * (angle / str.length) / 2);
    for (var n = 0; n < str.length; n++) {
        context.rotate(angle / str.length);
        context.save();
        context.translate(0, -1 * radius);
        var char = str[n].toString();
        context.fillStyle = colors.navy;
        context.strokeStyle = colors.white;
        context.fillText(char, 0, 0);
        context.strokeText(char, 0, 0);
        context.restore();
    }
    context.restore();
}

module.exports = {
    async run(hodnotyin) {
        let info = hodnotyin.info
        let pocet_cisel = hodnotyin.pocet_cisel
        let ruleta_cisla = hodnotyin.ruleta_cisla
        let cisla = [];
        let info_color = hodnotyin.info_color

        ruleta_cisla.forEach(cislo => {
            cisla.push(cislo.number)
        })

        const canvas = createCanvas(500, 500);
        const ctx = canvas.getContext('2d');

        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var angle = Math.PI * 2;
        var radius = 180;

        const background = await loadImage(join(__dirname, "..", "pictures", "xp_background.jpg"));
        ctx.globalAlpha = 0;
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        let rozdeleni = (Math.PI * 2) / pocet_cisel
        let posun = rozdeleni / 2

        for (c = 0; c < pocet_cisel; c++) {
            ctx.beginPath();
            ctx.globalAlpha = 1;
            ctx.moveTo(250, 250);
            ctx.arc(250, 250, 225, rozdeleni * c - posun, rozdeleni * (c + 1) - posun, false);
            ctx.lineTo(250, 250);
            ctx.lineWidth = 6;
            ctx.fillStyle = ruleta_cisla[c].color;
            ctx.fill();
            ctx.closePath();
        }

        drawTextAlongArc(ctx, cisla, centerX, centerY, radius, angle);


        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 3;
        ctx.moveTo(475, 250);
        ctx.lineTo(415, 250);
        ctx.strokeStyle = colors.yellow;
        ctx.stroke();
        ctx.closePath();


        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.arc(250, 250, 165, 0, Math.PI * 2, true);
        ctx.lineWidth = 6;
        ctx.strokeStyle = colors.gray;
        ctx.stroke();
        ctx.fillStyle = info_color || ruleta_cisla[0].color;
        ctx.fill();
        ctx.closePath();

        if (!hodnotyin.start || true) {
            let number = cisla[0].toString()
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.font = "bold 120pt Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = 'middle';
            ctx.fillStyle = colors.navy;
            ctx.strokeStyle = colors.white;
            ctx.fillText(number, 250, 250);
            ctx.strokeText(number, 250, 250);
            ctx.closePath();
        }

        const attachment = new MessageAttachment(canvas.toBuffer(), `rulet_${info}.png`);

        let hodnotyout = ({ zprava: attachment, roomname: require("../../botconfig/roomnames.json").botcommand })
        let message = await find_channel_by_name.run(hodnotyout)

        if (hodnotyin.start || false) {
            let emoji_list = ["⚫", "🟢", "🔴"]
            emoji_list.forEach(e => {
                message.react(e)
            })
            rulet.rulet.message = message
        }

    }
}