const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage, Canvas } = require("canvas");
const { join } = require("path");
const color = require("../../colorpaletes/colors.json")

async function vypocet_radku(reason, max_reason_length) {
    let delka = reason[0].length
    let output
    let last_element = 0
    let pocet_radku = 0
    let radek = []
    await reason.forEach(async element => {
        let index_of_element = reason.indexOf(element)
        let index_of_next_element = index_of_element

        if (reason[index_of_next_element] != undefined) {
            if ((delka + reason[index_of_next_element].length) <= max_reason_length) {
                delka = delka + reason[index_of_next_element].length + 1
                radek.push(element)
            }
            else {
                if (output == NaN || output == undefined) {
                    output = radek.join(" ") + "\n"
                    radek = []
                }

                else {
                    output = output + radek.join(" ") + "\n"
                    radek = []
                }
                last_element = index_of_element
                pocet_radku++
                delka = reason[index_of_next_element].length
            }
        }
    });
    pocet_radku++
    if (output == NaN || output == undefined) {
        output = radek.join(" ")
    }

    else {
        output = output + radek.join(" ")
    }
    return [output, pocet_radku]
}

module.exports = {
    async run(hodnoty) {
        let target = hodnoty.target
        let reason = hodnoty.reason
        let author = hodnoty.author
        let reported_by = `${author.username}#${author.discriminator}`
        let avatar_size = 512
        let max_reason_length = 37
        let vypocet = await vypocet_radku(reason, max_reason_length)
        let radky = vypocet[0]
        let pocet_radku = vypocet[1]
        let rozsireni = 0
        if (pocet_radku > 7) {
            rozsireni = pocet_radku - 7
        }

        const canvas = createCanvas(1000, 333 + 35 * rozsireni);
        const ctx = canvas.getContext('2d');
        const background = await loadImage(join(__dirname, "../..", "pictures", "xp_background.jpg"));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.font = "30px Arial";
        ctx.fillStyle = color.white;
        ctx.textAlign = "left"
        ctx.fillText(target.username + "#" + target.discriminator + " byl nahlášen.", 300, 70);

        ctx.fillText("Důvod: ", 300, 110);
        ctx.fillText(radky, 405, 110);


        ctx.arc(170, 160, 120, 0, Math.PI * 2, true);
        ctx.lineWidth = 6;
        ctx.strokeStyle = color.white;
        ctx.stroke();
        ctx.closePath();
        ctx.clip();
        const avatar = await loadImage(target.displayAvatarURL({ format: "jpg", size: avatar_size }));
        ctx.drawImage(avatar, 40, 40, avatar_size / 2, avatar_size / 2);

        const attachment = new MessageAttachment(canvas.toBuffer(), `reported_by_${reported_by}.png`);
        return attachment
    }
}