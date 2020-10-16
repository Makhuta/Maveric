const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage, Canvas } = require("canvas");
const { join } = require("path");
const { bot } = require('../../bot');
const xpcolor = require("../../colorpaletes/xpcolor.json")
const find_channel_by_name = require("../channelfinder/find_channel_by_name")

module.exports = {
    async run(top10, message) {
        const canvas = createCanvas(1600, 1000);
        const ctx = canvas.getContext('2d');
        const background = await loadImage(join(__dirname, "../..", "pictures", "xp_background.jpg"));
        var vyska = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900]
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        let top10length0 = top10.length - 1



        for (l = 0; l <= top10length0; l++) {
            var xpToNextLevel = 5 * Math.pow(top10[l].level, 2) + 50 * top10[l].level + 100
            var procenta = Math.round(top10[l].xp / (xpToNextLevel / 100))
            var sirka = ((100 / (xpToNextLevel)) * top10[l].xp) * 7.7;
            var delkajmena = top10[l].username.length
            var namepart1 = top10[l].username.slice(0, 17)
            var namepart2 = top10[l].username.slice(17)
            //console.log(message.guild.members.cache.get(bot.user.id))

            let target = top10[l].user || bot.user



            var avatar = await loadImage(target.displayAvatarURL({ format: "jpg", size: 64 }));

            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#ffffff";
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(430, vyska[l] + 20, 770, 65);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.strokeRect(430, vyska[l] + 20, 770, 65);
            ctx.stroke();

            ctx.globalAlpha = 0.6;
            ctx.fillStyle = `${xpcolor[procenta]}`;
            ctx.fillRect(430, vyska[l] + 20, sirka, 65);
            ctx.fill();
            ctx.globalAlpha = 1;

            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(`${top10[l].xp}/${xpToNextLevel} XP`, 815, vyska[l] + 64);


            ctx.font = "30px Arial";
            ctx.textAlign = "left"
            ctx.fillStyle = "#ffffff";
            if (delkajmena <= 17) {
                ctx.fillText(top10[l].username, 130, vyska[l] + 50);
            }
            else {
                ctx.fillText(namepart1, 130, vyska[l] + 50);
                ctx.fillText(namepart2, 130, vyska[l] + 85);
            }


            ctx.font = "30px Arial";
            ctx.textAlign = "left"
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Level: " + top10[l].level, 1230, vyska[l] + 50);

            ctx.font = "30px Arial";
            ctx.textAlign = "left"
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Rank: " + top10[l].rank, 1430, vyska[l] + 50);

            ctx.arc(50, vyska[l] + 50, 40, 0, Math.PI * 2, true);
            ctx.lineWidth = 6;
            ctx.strokeStyle = "#ffffff";
            ctx.save()
            ctx.stroke();
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, 10, vyska[l] + 10, 80, 80);
            ctx.restore()

            //console.log(top10[l].username.slice(0, 17))
        }


        const attachment = new MessageAttachment(canvas.toBuffer(), "rank.png");

        let hodnotyout = ({ zprava: attachment, roomname: require("../../botconfig/roomnames.json").botcommand })
        find_channel_by_name.run(hodnotyout)
    }
}