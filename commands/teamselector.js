const { prefix } = require("../botconfig.json")
const { bot } = require('../bot');
const Discord = require("discord.js");
const color = require("../colorpaletes/colors.json")
const shuffle = require("../handlers/shuffle/shuffle")
const teamselector_canvas = require("../handlers/teamselector/teamselector_canvas")

const name = "teamselector"
const description = ""
const usage = prefix + name
const accessableby = ["Member"]
const aliases = ["ts"]

var teamsize, half_teamsize, message_author_channel

function vystup(args) {
    let hodnoty = ({ array: args })
    shuffle.run(hodnoty)

    let team_a_no = (args.slice(0, half_teamsize))
    let team_b_no = (args.slice(half_teamsize, teamsize))

    team_a = ["Tým 1:"]
    team_b = ["Tým 2:"]

    for (t = 0; t < team_a_no.length; t++) {
        team_a.push(team_a_no[t])
    }

    for (t = 0; t < team_b_no.length; t++) {
        team_b.push(team_b_no[t])
    }

    let hodnoty_canvas = ({ team_a: team_a, team_b: team_b, half_teamsize: half_teamsize })
    teamselector_canvas.run(hodnoty_canvas)

}



function errorzprava(vystup) {
    let embedneu = new Discord.MessageEmbed()
        .setAuthor('Chyba')
        .setDescription(`Nenacházíš se v místnosti s potřebným počtem lidí pro utvoření týmů o alespoň jednom hráči.\nPoužij buď příkaz **${prefix}teamselector [args]** nebo se připoj do místnosti s více lidmi.`)
        .setColor(color.red)
    vystup.send(embedneu)
}

module.exports.run = async (message, args) => {
    teamsize = args.length
    half_teamsize = Math.ceil(teamsize / 2)
    message_author_channel = message.member.voice.channel

    if (teamsize !== 0) {
        vystup(args)
        return
    }

    if (message_author_channel === null) {
        errorzprava(message.author)
        return
    }

    else {
        let message_author_channel_name = message_author_channel.name

        let get_channel = message.guild.channels.cache.find(c => c.name === message_author_channel_name);
        let mems = get_channel.guild.members.guild.voiceStates.cache;
        let usrchid = mems.get(message.author.id).channelID
        let members_in_voice_channel = mems.filter(m => m.channelID === usrchid)
        let membersize_with_author = members_in_voice_channel.size
        let membersize_no_author = membersize_with_author - 1
        let members_in_voice_channel_array = []
        members_in_voice_channel.forEach(user => {
            let user_usermane = message.guild.members.cache.get(user.id).user.username
            if(user_usermane.length > 15){
                user_usermane = user_usermane.slice(0, 15) + "..."
            }
            members_in_voice_channel_array.push(user_usermane)
        });

        teamsize = members_in_voice_channel_array.length
        half_teamsize = Math.ceil(teamsize / 2)
        console.log(members_in_voice_channel_array)
        vystup(members_in_voice_channel_array)
    }

}

module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}