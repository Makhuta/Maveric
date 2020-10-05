const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage, Canvas } = require("canvas");
const { join } = require("path");
const botconfig = require("../../botconfig.json");
const roundTo = require('round-to');
const rainbow = require('../../colorpaletes/rainbow.json')


module.exports = {
    async run(message, guild) {
        var numofallmemb = guild.memberCount.toLocaleString()
        const botroleid = guild.roles.cache.find(r => r.name === botconfig.botrolename).id
        var numofallbots = guild.roles.cache.get(botroleid).members.size
        var numofallmembnobots = (numofallmemb - numofallbots)
        var numofallmembnobotsstring = numofallmembnobots.toLocaleString()

        var length_of_members = numofallmembnobotsstring.length * -1
        var goal = roundTo.up(numofallmembnobots, length_of_members)
        var sto_procent = goal
        var jedno_procento = sto_procent / 100
        var nezname_procenta = numofallmembnobots
        var procenta = (nezname_procenta / jedno_procento)
        var procenta_setina = procenta / 100

        const canvas = createCanvas(1000, 500);
        const ctx = canvas.getContext('2d');
        const background = await loadImage(join(__dirname, "../..", "pictures", "xp_background.jpg"));
        const guildavatar = await loadImage(guild.iconURL({ format: "jpg", size: 512 }));
        const pi = Math.PI
        const circle = 2 * pi 
        const zacinajiciuhel = circle * 0.75
        const konecnyuhel = circle * procenta_setina + zacinajiciuhel
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
        ctx.fillStyle = "#ffffff";
        ctx.fill()
        ctx.stroke();
        ctx.closePath();

        for (let i = 3; i <= 196; i++) {
            ctx.beginPath();
            ctx.arc(750, 250, i, zacinajiciuhel, konecnyuhel, false);
            ctx.lineWidth = 6;
            ctx.strokeStyle = `${rainbow[i - 3]}`;
            ctx.save()
            ctx.stroke();
            ctx.closePath();
            ctx.clip();
            ctx.restore()
        }

        ctx.beginPath();
        ctx.arc(750, 250, 200, 0, pi * 2, true);
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
        ctx.closePath();

        const attachment = new MessageAttachment(canvas.toBuffer(), "member_goal.png");
        message.channel.send(attachment)
    }
}