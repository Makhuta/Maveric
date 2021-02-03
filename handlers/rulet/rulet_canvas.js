const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage, Canvas } = require("canvas");
const { join } = require("path");
const colors = require("../../colorpaletes/colors.json")
const find_channel_by_name = require("../../handlers/channelfinder/find_channel_by_name")
const rulet = require("../../commands/rulet")

module.exports = {
    async run(hodnotyin) {
        let info = hodnotyin.info
        let pocet_cisel = hodnotyin.pocet_cisel
        let ruleta_cisla = hodnotyin.ruleta_cisla
        let info_color = hodnotyin.info_color
        const canvas = createCanvas(500, 500);
        const ctx = canvas.getContext('2d');
        const background = await loadImage(join(__dirname, "../..", "pictures", "xp_background.jpg"));
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