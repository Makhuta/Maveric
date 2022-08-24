const { createCanvas, loadImage } = require("canvas");
const { MessageAttachment } = require("discord.js");
const { join } = require("path");
const color = require(join(ColorPaletes, "colors.json"));

module.exports = {
  run: async (hodnoty) => {
    let channel = hodnoty.channel;
    let target = hodnoty.target;
    let user_username = target.username;
    let stav = hodnoty.stav;
    let datum = hodnoty.datum;
    let guild = channel.guild

    if (user_username.length >= 20) {
      user_username = user_username.slice(0, 20) + "...";
    }

    let sirka = 1000;
    let vyska = 400;
    let odstup1 = 20;
    let polomer = 120;
    let sirkacary = 10;
    let rozliseni = 512;
    let vzdalenost_od_avataru = 20;
    let vzdalenost1 = 5;
    let sirkapole = 60;
    let velikost_textu = 15;
    let text_mensi_o = velikost_textu - 3;
    let stav_font = "Square";
    let barvy = [color.light_blue, color.red];
    let obraz_jmeno = ["Join", "Leave"];
    let verze_pro_datum = ["Joined", "Member since"];
    let stav_barva;

    if (stav === "Welcome") stav_barva = 0;
    else stav_barva = 1;

    const canvas = createCanvas(sirka, vyska);
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.miterLimit = 1;
    ctx.globalAlpha = 1;
    ctx.fillStyle = color.dark_gray;
    ctx.fillRect(0, 0, sirka, vyska);
    ctx.fill();

    ctx.fillStyle = color.mid_gray;
    ctx.fillRect(odstup1, odstup1, sirka - odstup1 * 2, vyska - odstup1 * 2);
    ctx.fill();

    ctx.fillStyle = color.dark_gray;
    ctx.fillRect(vyska / 2 + polomer + vzdalenost_od_avataru, vyska / 2 - sirkapole - vzdalenost1, sirka - (vyska / 2 + polomer + vzdalenost_od_avataru) - 40, sirkapole);
    ctx.fill();

    ctx.textAlign = "left";
    ctx.lineWidth = sirkacary;
    ctx.font = `80px ${stav_font}`;
    ctx.strokeText(stav, vyska / 2 + polomer + vzdalenost_od_avataru + text_mensi_o, 110);

    ctx.fillStyle = barvy[stav_barva];
    ctx.textAlign = "left";
    ctx.font = `lighter 80px ${stav_font}`;
    ctx.fillText(stav, vyska / 2 + polomer + vzdalenost_od_avataru + text_mensi_o, 110);

    ctx.fillStyle = color.white;
    ctx.textAlign = "left";
    ctx.font = `${sirkapole - velikost_textu}px Arial Black`;
    ctx.fillText(user_username, vyska / 2 + polomer + vzdalenost_od_avataru + text_mensi_o, vyska / 2 - vzdalenost1 - text_mensi_o);

    ctx.fillStyle = color.dark_gray;
    ctx.fillRect(vyska / 2 + polomer + vzdalenost_od_avataru, vyska / 2 + vzdalenost1, 190, sirkapole);
    ctx.fill();

    ctx.fillStyle = color.white;
    ctx.textAlign = "left";
    ctx.font = `${sirkapole - velikost_textu}px Arial Black`;
    ctx.fillText("# " + target.discriminator, vyska / 2 + polomer + vzdalenost_od_avataru + text_mensi_o, vyska / 2 + sirkapole + vzdalenost1 - text_mensi_o);

    ctx.fillStyle = color.dark_gray;
    ctx.fillRect(vyska / 2 + polomer - 60, vyska - 30 - sirkapole, sirka - (vyska / 2 + polomer - 60) - 40, sirkapole);
    ctx.fill();

    ctx.fillStyle = color.white;
    ctx.textAlign = "left";
    ctx.font = `${sirkapole - velikost_textu}px Arial Black`;
    ctx.fillText(`${verze_pro_datum[stav_barva]}: ` + datum, vyska / 2 + polomer + text_mensi_o - 60, vyska - 42);

    ctx.globalAlpha = 1;
    ctx.arc(vyska / 2, vyska / 2, polomer, 0, Math.PI * 2, true);
    ctx.lineWidth = sirkacary;
    ctx.strokeStyle = barvy[stav_barva];
    ctx.stroke();
    ctx.closePath();
    ctx.clip();
    const avatar = await loadImage(target.displayAvatarURL({ format: "jpg", size: rozliseni }));
    ctx.drawImage(avatar, vyska / 2 - polomer - sirkacary, vyska / 2 - polomer - sirkacary, 256, 256);

    const attachment = new MessageAttachment(canvas.toBuffer(), `${obraz_jmeno[stav_barva]}.png`);
    channel.send({ files: [attachment] }).catch((error) => {
      InfoHandler["MemberJoinError"] = {};
      if (InfoHandler["MemberJoinError"][guild.id] == undefined) {
        InfoHandler["MemberJoinError"][guild.id] = [];
      }
      InfoHandler["MemberJoinError"][guild.id].push({
        ErrorMessage: error,
        guildID: guild.id
      });
      GuildsConfigs[guild.id]["config"]["WELCOMERENABLEDERRORED"] = "false";
    });
  }
};
