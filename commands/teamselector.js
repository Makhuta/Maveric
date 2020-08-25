const Discord = require("discord.js");
const { prefix } = require("../botconfig.json")
const color = require("../colors.json")
const fs = require("fs");
const { replaceResultTransformer } = require("common-tags");
const { url } = require("inspector");
const { isNull } = require("util");

const name = "teamselector"
const description = "Slouží k random rozhození lidí do týmu."
const usage = `${prefix}teamselector`
const accessableby = ["Member"]
const aliases = ["ts"]

module.exports.run = async (bot, message, args) => {
    var teamsize = args.length
    var teamsize0 = (Math.round((teamsize / 2) + 0, 5)) - 1
    //console.log(message.member.guild.members.cache)
    //bot.users.fetch(`${message.author.id}`)

    function shuffle(array) {
        let counter = array.length;
        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
            counter--;
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

    function errorzprava() {
        let embedneu = new Discord.MessageEmbed()
            .setAuthor('Chyba')
            .setDescription(`Nenacházíš se v místnosti s potřebným počtem lidí pro utvoření týmů o alespoň jednom hráči.\nPoužij buď příkaz **${prefix}teamselector [args]** nebo se připoj do místnosti s více lidmi.`)
            .setColor(color.red)
        message.channel.send(embedneu)
    }

    if (teamsize !== 0) {
        vystupargs(args)
    }

    else if (message.member.voice.channel === null) {
        console.log("VCH = null")
        errorzprava()
        return
    }

    else {
        let membervchname = message.member.voice.channel.name
        let membervchid = message.member.voice.channel.id

        let chan = message.guild.channels.cache.find(c => c.name === membervchname);
        let mems = chan.guild.members.guild.voiceStates.cache;
        let memsid = mems.map(n => n.id)
        let memssize = memsid.length
        let usrchid = mems.get(message.author.id).channelID
        const usraray = []
        var membersize = 0

        mems.forEach(element => {

            if (usrchid === element.channelID) {
                membersize = membersize + 1
            }
        })



        for (let m = 0; m < membersize; m++) {
            let allid = mems.get(memsid[m]).channelID
            if (usrchid === allid) {
                let usrname = message.member.guild.members.cache.find(n => n.id === memsid[m]).user.username
                usraray.push(usrname)
            }
        }

        if (usraray.length <= 1) {
            console.log("usraray.length")
            errorzprava()
            return
        }

        //console.log(usraray)

        vystupnoargs(usraray)
    }

}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}