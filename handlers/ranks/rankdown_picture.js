const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage, Canvas } = require("canvas");
const { join } = require("path");
const colors = require("../../colorpaletes/colors.json");

function sipka(ctx, stred_x, stred_y, sirka_sipka) {

    //Light part
    ctx.beginPath();
    ctx.moveTo(stred_x - 200, stred_y)
    ctx.lineTo(stred_x - sirka_sipka / 2, stred_y + sirka_sipka + 50)
    ctx.lineTo(stred_x + sirka_sipka / 2, stred_y + sirka_sipka + 50)
    ctx.lineTo(stred_x + 200, stred_y)
    ctx.lineTo(stred_x + 200 - sirka_sipka * 1.6, stred_y)
    ctx.lineTo(stred_x + sirka_sipka / 2, stred_y + 50)
    ctx.lineTo(stred_x - sirka_sipka / 2, stred_y + 50)
    ctx.lineTo(stred_x - 200 + sirka_sipka * 1.6, stred_y)
    ctx.fillStyle = `${colors.red}`;
    ctx.fill();
    ctx.closePath();

    //Dark part
    ctx.beginPath();
    ctx.moveTo(stred_x - 200 + 24, stred_y + 6)
    ctx.lineTo(stred_x - sirka_sipka / 2 + 6, stred_y + sirka_sipka + 50 - 6)
    ctx.lineTo(stred_x + sirka_sipka / 2 - 6, stred_y + sirka_sipka + 50 - 6)
    ctx.lineTo(stred_x + 200 - 24, stred_y + 6)
    ctx.lineTo(stred_x + 200 - sirka_sipka * 1.6 + 6, stred_y + 6)
    ctx.lineTo(stred_x + sirka_sipka / 2 + 6, stred_y + 50 + 6)
    ctx.lineTo(stred_x - sirka_sipka / 2 - 6, stred_y + 50 + 6)
    ctx.lineTo(stred_x - 200 + sirka_sipka * 1.6 - 6, stred_y + 6)
    ctx.fillStyle = `${colors.maroon}`;
    ctx.fill();
    ctx.closePath();

}

function level_cislo(ctx, stred_x, stred_y, level) {
    ctx.beginPath();
    ctx.font = "300px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = `${colors.silver}`;
    ctx.fillText(level, stred_x, stred_y);
    ctx.closePath();
}


module.exports = {
    async run(message, level, target) {

        //console.log(message.author.avatar)

        const canvas = createCanvas(550, 1100);
        const ctx = canvas.getContext('2d');
        const background = await loadImage(join(__dirname, "../..", "pictures", "rankup_background.jpg"));
        const avatar = await loadImage((target || message.author).displayAvatarURL({ format: "jpg", size: 512 }));
        const pi = Math.PI;
        const canvas_sirka = canvas.width;
        const stred_sipky_x = 275
        const stred_sipky_y = 800
        const stred_lvlu_x = 275
        const stred_lvlu_y = 760
        const canvas_vyska = canvas.height;
        const sirka_sipka = 60;
        const sirka_cary = 20;
        const dalka_od_okraje = 50;
        const velikost = canvas_vyska / 4 - dalka_od_okraje;
        const velikost_avatar = velikost * 2;
        const pozice_avatar = dalka_od_okraje;

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(canvas_sirka / 2, canvas_vyska / 4, velikost, 0, pi * 2, true);
        ctx.lineWidth = sirka_cary;
        ctx.strokeStyle = "#ffffff";
        ctx.save()
        ctx.stroke();
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, pozice_avatar, pozice_avatar, velikost_avatar, velikost_avatar);
        ctx.restore()


        for (let s = 0; s < 3; s++) {
            sipka(ctx, stred_sipky_x, stred_sipky_y + (sirka_sipka + 20) * s, sirka_sipka)
        }
        level_cislo(ctx, stred_lvlu_x, stred_lvlu_y, level)

        const attachment = new MessageAttachment(canvas.toBuffer(), "rankdown.png");

        target.send(attachment)
    }
}