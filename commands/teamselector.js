const Discord = require("discord.js");
const { prefix } = require("../botconfig.json")
const color = require("../colors.json")
const fs = require("fs");
const { replaceResultTransformer } = require("common-tags");

module.exports.run = async (bot, message, args) => {
    const teamsize = args.length
    const teamsize0 = (Math.round(teamsize / 2)) - 1

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

    //console.log(teamsize0)

    if (teamsize !== 0) {

        //console.log(args)
        shuffle(args)
        //console.log(args)

        var team1 = args.slice(teamsize0 + 1, teamsize)

        var team2 = args.slice(0 ,teamsize0 + 1)

        var embed = new Discord.MessageEmbed()
            .addFields(
                { name: '**Team 1**', value: `${team1}` },
                { name: '**Team 2**', value: `${team2}` }
            )
            .setColor(color.red)
        message.channel.send(embed)
    }

}

module.exports.help = {
    name: "teamselector",
    description: "Slouží k random rozhození lidí do týmu.",
    usage: `${prefix}teamselector`,
    accessableby: "Member",
    aliases: ["ts"]
}
