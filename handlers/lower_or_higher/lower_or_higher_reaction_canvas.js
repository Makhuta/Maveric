const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage, Canvas } = require("canvas");
const { join } = require("path");
const find_channel_by_name = require("../channelfinder/find_channel_by_name")
const color = require("../../colorpaletes/colors.json")
const emojinames = require("../../botconfig/emojinames.json")

var zprava_pro_reakce
var cislo_sazka
var author
var target
var sazka_xp
var nahodnecislo

module.exports = {
    run: async (hodnoty) => {
        cislo_sazka = hodnoty.cislo_sazka
        author = hodnoty.author
        target = hodnoty.target
        sazka_xp = hodnoty.sazka_xp
        let message = hodnoty.message
        nahodnecislo = hodnoty.nahodnecislo


        let author_username = author.username
        let target_username = target.username

        if (author_username.length > 15) {
            author_username = author_username.slice(0, 15) + "..."
        }

        if (target_username.length > 15) {
            target_username = target_username.slice(0, 15) + "..."
        }

        let author_info = [author_username, sazka_xp]
        let target_info = [target_username, sazka_xp]

        let vyska = 100
        let sirka = 6 * vyska
        let sirka_half = sirka / 2

        const canvas = createCanvas(sirka, vyska);
        const ctx = canvas.getContext('2d');
        const background = await loadImage(join(__dirname, "../..", "pictures", "xp_background.jpg"));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


        for (a = 0; a < author_info.length; a++) {
            ctx.beginPath();
            ctx.font = "30px Calibri";
            ctx.textAlign = "center";
            ctx.fillStyle = color.light_blue;
            ctx.fillText(author_info[a], sirka_half / 2, 45 + 30 * a);
            ctx.closePath();
        }

        for (t = 0; t < target_info.length; t++) {
            ctx.beginPath();
            ctx.font = "30px Calibri";
            ctx.textAlign = "center";
            ctx.fillStyle = color.red;
            ctx.fillText(target_info[t], sirka_half / 2 * 3, 45 + 30 * t);
            ctx.closePath();
        }

        ctx.beginPath();
        ctx.font = "50px Calibri";
        ctx.textAlign = "center";
        ctx.fillStyle = color.white;
        ctx.fillText("VS", sirka_half, 45 + 20);
        ctx.closePath();






        const attachment = new MessageAttachment(canvas.toBuffer(), `lower_or_higher.png`);

        let hodnotyout = ({ zprava: attachment, roomname: require("../../botconfig/roomnames.json").botcommand })
        zprava_pro_reakce = await find_channel_by_name.run(hodnotyout)




        await zprava_pro_reakce.react(emojinames.up)
        await zprava_pro_reakce.react(emojinames.down)




        module.exports.loh.zprava_pro_reakce = zprava_pro_reakce
        module.exports.loh.author = author
        module.exports.loh.target = target
        module.exports.loh.sazka_xp = sazka_xp
        module.exports.loh.cislo_sazka = cislo_sazka
        module.exports.loh.nahodnecislo = nahodnecislo
        module.exports.loh.stav_her = Date.now()


        zprava_pro_reakce.delete({ timeout: 60000 })
            
    }
}

module.exports.loh = {
    zprava_pro_reakce: "",
    author: "",
    target: "",
    sazka_xp: "",
    cislo_sazka: "",
    reakce: "",
    nahodnecislo: "",
    stav_her: 0
}