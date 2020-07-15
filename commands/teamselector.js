const Discord = require("discord.js");
const { prefix } = require("../botconfig.json")
const color = require("../colors.json")
const fs = require("fs");
const { replaceResultTransformer } = require("common-tags");
const { url } = require("inspector");
const { isNull } = require("util");

module.exports.run = async (bot, message, args) => {
    var teamsize = args.length
    var teamsize0 = (Math.round((teamsize / 2) + 0, 5)) - 1

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

    function vystupnoargs(a) {
        shuffle(a)
        let asize = a.length
        let asizehalf = Math.round((asize / 2) + 0, 5)
        let team3 = (a.slice(asizehalf, asize)).join('\n')
        let team4 = (a.slice(0, asizehalf)).join('\n')
        let boturl = bot.user.displayAvatarURL({ format: "png", size: 512 })
        let team = [`${team3}`, `${team4}`]
        shuffle(team)

            let embed1 = new Discord.MessageEmbed()
                .addFields(
                    { name: '**Team 1**', value: `${team[0]}` || 'Hráč/i nebyl/i definován/i', inline: true },
                    { name: '**Team 2**', value: `${team[1]}` || 'Hráč/i nebyl/i definován/i', inline: true }
                )
                .setColor(color.red)
                .setTimestamp()
                .setFooter(bot.user.username, boturl)
            message.channel.send(embed1)
        
    }

    function vystupargs(a) {
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

        vystupargs(args)

    }

    else {
        let membervch = message.member.voice.channel
        let membervchname = membervch.name

        if (!membervch) return
        let chan = bot.channels.cache.find(c => c.name === membervchname);
        let mems = chan.guild.members.guild.voiceStates.cache;
        let memsid = mems.map(n => n.id)
        let memssize = memsid.length
        let usrchid = mems.get(message.author.id).channelID
        let usraray = ""
        var membersize = 0

        mems.forEach(element => {

            if (usrchid === element.channelID) {
                membersize = membersize + 1
            }
        })



        for (let m = 0; m < membersize; m++) {
            let allid = mems.get(memsid[m]).channelID
            if (usrchid === allid) {
                let usrname = bot.users.cache.find(n => n.id === memsid[m]).username
                if (m !== membersize - 1) {
                    usraray = usraray.concat(usrname + ",")
                }

                else {
                    usraray = usraray.concat(usrname)
                }
            }
            else { }
        }

        let usraraysliced = usraray.split(",")
        //delete usraraysliced[usraraysliced.find(m => m === '')]
        vystupnoargs(usraraysliced)
        delete usraraysliced
    }

}

module.exports.help = {
    name: "teamselector",
    description: "Slouží k random rozhození lidí do týmu.",
    usage: `${prefix}teamselector`,
    accessableby: "Member",
    aliases: ["ts"]
}