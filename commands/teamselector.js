const Discord = require("discord.js");
const { prefix } = require("../botconfig.json")
const color = require("../colors.json")
const fs = require("fs");
const { replaceResultTransformer } = require("common-tags");
const { url } = require("inspector");
const { isNull } = require("util");

module.exports.run = async (bot, message, args) => {
    var teamsize = args.length
    var teamsizehalf = (Math.round((teamsize / 2) + 0, 5))
    var teamsizehalf0 = teamsizehalf - 1

    function shuffle(array) {
        let counter = array.length;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }

    function vstupargs(a) {
        shuffle(a)

        let team1 = (a.slice(teamsize0 + 1, teamsize)).join('\n')
        let team2 = (a.slice(0, teamsize0 + 1)).join('\n')
        let boturl = bot.user.displayAvatarURL({ format: "png", size: 512 })


        let embed = new Discord.MessageEmbed()
            .addFields(
                { name: '**Team 1**', value: `${team1}` || 'Hráč/i nebyl/i definován/i', inline: true },
                { name: '**Team 2**', value: `${team2}` || 'Hráč/i nebyl/i definován/i', inline: true }
            )
            .setColor(color.red)
            .setTimestamp()
            .setFooter(bot.user.username, boturl)
        message.channel.send(embed)
    }


    
    if (teamsize !== 0) {

        vstupargs(args)

    }
}

module.exports.help = {
    name: "teamselector",
    description: "Slouží k random rozhození lidí do týmu.",
    usage: `${prefix}teamselector`,
    accessableby: "Member",
    aliases: ["ts"]
}