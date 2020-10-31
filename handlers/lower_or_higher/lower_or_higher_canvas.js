const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage, Canvas } = require("canvas");
const { join } = require("path");
const find_channel_by_name = require("../channelfinder/find_channel_by_name")
const lower_or_higher_reaction_canvas = require("./lower_or_higher_reaction_canvas").loh
const color = require("../../colorpaletes/colors.json")


module.exports = {
    run: async (hodnoty) => {
        let cislo_sazka = lower_or_higher_reaction_canvas.cislo_sazka
        let author = lower_or_higher_reaction_canvas.author
        let target = lower_or_higher_reaction_canvas.target
        let sazka_xp = lower_or_higher_reaction_canvas.sazka_xp
        let nahodnecislo = lower_or_higher_reaction_canvas.nahodnecislo

        let result = hodnoty.result






        let author_username = author.username
        let target_username = target.username

        if (author_username.length > 10) {
            author_username = author_username.slice(0, 10) + "..."
        }

        if (target_username.length > 10) {
            target_username = target_username.slice(0, 10) + "..."
        }

        let result_username_array = [author_username, target_username]
        let result_username = [result_username_array[result[0]], result_username_array[result[1]]]

        let colors_result_array = [color.light_blue, color.red]
        let colors_result = [colors_result_array[result[0]], colors_result_array[result[1]]]

        let vyska = 120
        let sirka = 4 * vyska
        let vyska_half = vyska / 2
        let sirka_half = sirka / 2

        let pozice1 = cislo_sazka * 4 + 20
        let pozice2 = -(sirka - pozice1 - 20)

        let nahodne_x = (sirka / 100) * nahodnecislo + 10
        //console.log(nahodne_x)

        const canvas = createCanvas(sirka, vyska);
        const ctx = canvas.getContext('2d');
        const background = await loadImage(join(__dirname, "../..", "pictures", "xp_background.jpg"));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


        ctx.beginPath();
        ctx.font = "30px Calibri";
        ctx.textAlign = "center";
        ctx.fillStyle = colors_result[0];
        ctx.fillText(result_username[0], sirka_half / 2, 35);
        ctx.closePath();

        ctx.beginPath();
        ctx.font = "30px Calibri";
        ctx.textAlign = "center";
        ctx.fillStyle = colors_result[1];
        ctx.fillText(result_username[1], sirka_half / 2 * 3, 35);
        ctx.closePath();

        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ffffff";
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(10, vyska_half - 10, sirka - 20, vyska_half);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeRect(10, vyska_half - 10, sirka - 20, vyska_half);
        ctx.stroke();

        ctx.globalAlpha = 0.6;
        ctx.fillStyle = colors_result[0];
        ctx.fillRect(10, vyska_half - 10, pozice1, vyska_half);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.globalAlpha = 0.6;
        ctx.fillStyle = colors_result[1];
        ctx.fillRect(sirka - 10, vyska_half - 10, pozice2, vyska_half);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = color.black;
        ctx.moveTo(nahodne_x, vyska_half - 10);
        ctx.lineTo(nahodne_x, vyska - 10);
        ctx.stroke();
        ctx.closePath();



        const attachment = new MessageAttachment(canvas.toBuffer(), `loh_result.png`);

        let hodnotyout = ({ zprava: attachment, roomname: require("../../botconfig/roomnames.json").botcommand })
        find_channel_by_name.run(hodnotyout)
    }
}