const { bot, con } = require('../bot');
const { MessageAttachment } = require("discord.js");
const botconfig = require("../botconfig.json")
const color = require("../colors/colors.json")
const fs = require("fs");
const { createCanvas, loadImage, Canvas } = require("canvas");
const { join } = require("path");
const { createGzip } = require("zlib");
const canvasxp = require("../funkce/canvasxp")
const getrank = require("../funkce/getrank")

const name = "xp"
const description = `Vypíše počet XP`
const usage = `${botconfig.prefix}xp`
const accessableby = ["Member"]
const aliases = []

async function statistika(xp, level, target, message, xpToNextLevel, rank) {
    const canvas = createCanvas(1000, 333);
    const ctx = canvas.getContext('2d');
    const background = await loadImage(join(__dirname, "..", "pictures", "background.jpg"));
    var sirka = ((100 / (xpToNextLevel)) * xp) * 7.7;
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#ffffff";
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(180, 216, 770, 65);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeRect(180, 216, 770, 65);
    ctx.stroke();

    ctx.globalAlpha = 0.6;
    ctx.fillStyle = "#e67e22";
    ctx.fillRect(180, 216, sirka, 65);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${xp}/${xpToNextLevel} XP`, 600, 260);

    ctx.textAlign = "left"
    ctx.fillText(target.username + " #" + target.discriminator, 300, 80);

    ctx.font = "50px Arial";
    ctx.fillText("Level: #" + level, 300, 130);

    ctx.font = "50px Arial";
    ctx.fillText("Rank: #" + rank, 300, 180);

    ctx.arc(170, 160, 120, 0, Math.PI * 2, true);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.closePath();
    ctx.clip();
    const avatar = await loadImage(target.displayAvatarURL({ format: "jpg" }));
    ctx.drawImage(avatar, 40, 40, 250, 250);

    const attachment = new MessageAttachment(canvas.toBuffer(), "rank.png");
    message.channel.send(attachment)
}

function allxp(level, xp) {
    var xpecka = xp
    for (let l = 0; l < level; l++) {
        var xpToNextLevel = 5 * Math.pow(l, 2) + 50 * l + 100;
        xpecka = xpecka + xpToNextLevel;
    }
    /*sql = `UPDATE userstats SET allxp = ${xpecka} WHERE id = '${target.id}'`;
    con.query(sql)*/
    return (xpecka)
}

/*function getrank(xp, level, con, resid, resallxp, rank, target, message, xpToNextLevel) {
    con.query(`SELECT id, xp, level FROM userstats`, function (err, result, fields) {
        if (err) throw err;
        var usraray = []
        var reslength = result.length - 1
        for (let d = 0; d <= reslength; d++) {
            resid = result[d].id;
            let reslevel = result[d].level;
            let resxp = result[d].xp;
            resallxp = allxp(reslevel, resxp, target)
            usraray.push({id: resid, allxps: resallxp})
        }
        usraray.sort((a, b) => (a.allxps < b.allxps) ? 1 : (a.allxps === b.allxps) ? ((a.id < b.id) ? 1 : -1) : -1 )
        
        for (let d = 0; d <= reslength; d++) {
            if (usraray[d].id === target.id) {
                rank = d + 1
                //console.log(resid + " " + resallxp + " #" + rank)

                //console.log(usraray)
                statistika(xp, level, target, message, xpToNextLevel, rank)
            }

        }
       

    });
}*/

module.exports.run = async (bot, message, args, con) => {
    let target = message.mentions.users.first() || message.guild.members.cache.get(args[1]) || message.author;
    



    con.query(`SELECT * FROM userstats WHERE id = '${target.id}'`, (err, rows) => {
        if (err) throw err;



        if (!rows[0]) return message.channel.send("This user has no XP on record.")
        let xp = rows[0].xp
        let level = rows[0].level
        var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
        var callfunction = canvasxp.run
        getrank.run(xp, level, con, target, message, xpToNextLevel, callfunction)
    })
}


module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}