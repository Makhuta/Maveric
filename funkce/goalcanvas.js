const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage, Canvas } = require("canvas");
const { join } = require("path");
const { bot } = require('../bot');
const botconfig = require("../botconfig.json");
const roundTo = require('round-to');



function degres(stupne, pi) {
    var radiany = stupne * (pi / 180)// + (pi * 0.5)
    console.log(
        `Radiany: ${radiany}\n Stupně: ${stupne}`
    )
    return (radiany)
}

module.exports = {
    async run(message, guild) {
        var numofallmemb = guild.memberCount.toLocaleString()
        const botroleid = guild.roles.cache.find(r => r.name === botconfig.botrolename).id
        var numofallbots = guild.roles.cache.get(botroleid).members.size
        var numofallmembnobots = (numofallmemb - numofallbots)
        var numofallmembnobotsstring = numofallmembnobots.toLocaleString()

        //var first_int_of_members = numofallmembnobots.slice(0, 1)
        var length_of_members = numofallmembnobotsstring.length * -1
        var goal = roundTo.up(numofallmembnobots, length_of_members) //Calculate next goal
        var sto_procent = goal
        var jedno_procento = sto_procent / 100
        var nezname_procenta = numofallmembnobots
        var procenta = (nezname_procenta / jedno_procento)
        var procenta_setina = procenta / 100
        

        /*console.log(
            `first_int_of_members: ---\n length_of_members: ${length_of_members}\n goal: ${goal}\n sto_procent: ${sto_procent}\n jedno_procento: ${jedno_procento}\n nezname_procenta: ${nezname_procenta}\n procenta: ${procenta}\n procenta_na_stupne: ${procenta_na_stupne}`
        )*/

        const canvas = createCanvas(1000, 500);
        const ctx = canvas.getContext('2d');
        const background = await loadImage(join(__dirname, "..", "pictures", "background.jpg"));
        const guildavatar = await loadImage(guild.iconURL({ format: "jpg" }));
        const pi = Math.PI
        const pistart = pi * 1.5
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.save()
        ctx.arc(250, 250, 200, 0, pi * 2, true);
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(guildavatar, 50, 50, 400, 400);
        ctx.restore()

        //ctx.save()
        
        ctx.beginPath();
        ctx.arc(750, 250, 200, 0, pi * 2, true);
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#ffffff";
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = "blue";
        ctx.fill()
        ctx.stroke();
        ctx.closePath();

        for (let i = 3; i <= 196; i++) {
            ctx.beginPath();
            ctx.arc(750, 250, i, pistart, pistart * procenta_setina, true);
            ctx.lineWidth = 6;
            ctx.strokeStyle = "red";
            ctx.save()
            ctx.stroke();
            ctx.closePath();
            ctx.clip();
            ctx.restore()
            //console.log(i)
        }

        ctx.beginPath();
        ctx.arc(750, 250, 200, 0, pi * 2, true);
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
        ctx.closePath();
        //ctx.clip();


        console.log(procenta_setina)

        const attachment = new MessageAttachment(canvas.toBuffer(), "rank.png");
        message.channel.send(attachment)
    }
}