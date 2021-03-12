require("module-alias/register");
require("dotenv").config();
const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const { join } = require("path");
const xpcolor = require("@colorpaletes/xpcolor.json")
const colors = require("@colorpaletes/colors.json")
const botconfig = require("@events/load_config_from_database");


function roundRect(x, y, w, h, radius, context) {
    //var canvas = document.getElementById("canvas6");
    //var context = canvas.getContext("2d");
    var r = x + w;
    var b = y + h;
    context.beginPath();
    context.globalAlpha = 0.3;
    context.fillStyle = colors.white;
    context.lineWidth = "4";
    context.moveTo(x + radius, y);
    context.lineTo(r - radius, y);
    context.quadraticCurveTo(r, y, r, y + radius);
    context.lineTo(r, y + h - radius);
    context.quadraticCurveTo(r, b, r - radius, b);
    context.lineTo(x + radius, b);
    context.quadraticCurveTo(x, b, x, b - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.fill();
    context.globalAlpha = 1;
}

function textset(ctx, x, y, text) {
    ctx.beginPath();
    ctx.font = "60px Arial";
    ctx.fillStyle = colors.black;
    ctx.textAlign = "left"
    ctx.fillText(text, x, y); //70, 730);
    ctx.closePath();
}

function xp_bar(ctx, x, y, center, procenta, sirka, xp, xpToNextLevel) {
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = colors.white;
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = colors.white;
    ctx.fillRect(x, y, 860, 100);
    ctx.fill();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = `${xpcolor[procenta]}`;
    ctx.fillRect(x, y, sirka, 100);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.globalAlpha = 1;
    ctx.strokeRect(x, y, 860, 100);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = colors.white;
    ctx.fillText(`${xp}/${xpToNextLevel} XP`, center, y + 70);
}

module.exports = async function canvasprofile(user) {


    const canvas = createCanvas(1000, 2000);
    const ctx = canvas.getContext('2d');
    const background = await loadImage(join(__dirname, "..", "pictures", "profile_background.png"));
    let sirka = ((100 / (user.xpToNextLevel)) * user.xp) * 8.6;
    let procenta = Math.round(user.xp / (user.xpToNextLevel / 100))
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    let text_x = 70
    let text_y = 730



    roundRect(30, 650, 940, 1320, 20, ctx);


    /*ctx.beginPath();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = colors.white;
    ctx.roundedRectangle(30, 700, 940, 770, 20);
    ctx.moveTo(30, 700);
    ctx.lineTo(canvas.width - 30, 700);
    ctx.lineTo(canvas.width - 30, canvas.height - 50);
    ctx.lineTo(30, canvas.height - 50);
    ctx.lineTo(30, 700);
    ctx.fillRect();

    ctx.globalAlpha = 1;
    ctx.closePath();*/

    textset(ctx, text_x, text_y, user.language.USERNAME + user.username)
    text_y += 80;
    textset(ctx, text_x, text_y, user.language.DISC + user.discriminator)
    text_y += 80;
    textset(ctx, text_x, text_y, user.language.ID + user.id)
    text_y += 80;
    textset(ctx, text_x, text_y, user.language.TIER + user.tier)
    text_y += 80;
    textset(ctx, text_x, text_y, user.language.LEVEL + user.level)
    text_y += 80;
    textset(ctx, text_x, text_y, user.language.ALL_XP + user.allxp)
    text_y += 30;
    xp_bar(ctx, text_x, text_y, canvas.width / 2, procenta, sirka, user.xp, user.xpToNextLevel)
    text_y += 180;
    textset(ctx, text_x, text_y, user.language.LANG + user.language_name)
    text_y += 80;
    textset(ctx, text_x, text_y, user.language.CREATED + user.createdate)
    text_y += 80;
    textset(ctx, text_x, text_y, user.language.JOINED + user.joindate)
    text_y += 80;
    textset(ctx, text_x, text_y, user.language.ROLES + user.roles)
    text_y += 80;






    ctx.beginPath();
    ctx.arc(500, 340, 250, 0, Math.PI * 2, true);
    ctx.lineWidth = 20;
    ctx.strokeStyle = colors.light_blue;
    ctx.stroke();
    ctx.closePath();
    ctx.clip();
    const avatar = await loadImage(user.target.displayAvatarURL({ format: "jpg", size: 512 }));
    ctx.drawImage(avatar, 250, 90, 500, 500);

    const attachment = new MessageAttachment(canvas.toBuffer(), `profile_${user.username}.png`);
    let hodnoty = ({ zprava: attachment, roomname: botconfig.find(config => config.name == user.response).value, message: user.message })
    require("@handlers/find_channel_by_name").run(hodnoty)
}