const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const { join } = require("path");
const find_channel_by_name = require("../channelfinder/find_channel_by_name");
const { hostname } = require("os");


module.exports = {
    run: async (hodnoty) => {
        let half_teamsize = hodnoty.half_teamsize
        let team_a = hodnoty.team_a
        let team_b = hodnoty.team_b
        let vyska = (half_teamsize + 3) * 30// + 200
        let sirka = 600
        let sirka_half = sirka / 2
        console.log(vyska + " " + sirka + " " + half_teamsize)

        const canvas = createCanvas(sirka, vyska);
        const ctx = canvas.getContext('2d');
        const background = await loadImage(join(__dirname, "../..", "pictures", "xp_background.jpg"));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        for (t = 0; t <= half_teamsize; t++) {
            //Left side
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(team_a[t] || "No user", sirka_half / 2, 60 + t * 30);

            //Right side
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(team_b[t] || "No user", sirka_half / 2 * 3, 60 + t * 30);
        }



        const attachment = new MessageAttachment(canvas.toBuffer(), `selected_teams.png`);

        let hodnotyout = ({ zprava: attachment, roomname: require("../../botconfig/roomnames.json").botcommand })
        find_channel_by_name.run(hodnotyout)
    }
}