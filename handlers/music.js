require("module-alias/register");
require("dotenv").config();

const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const Discord = require("discord.js");
const color = require("@colorpaletes/colors.json")

const queue = new Map();

const response = "MUSIC_ROOM_NAME";



function song_embed(embed, song, type) {
    let types = ["🎶 Playing 🎶", "Addet to Queue"]
    embed.setTitle(types[type])
        .addFields({ name: "Name:", value: `[${song.title}](${song.url})` }, { name: "Author:", value: `[${song.author.name}](${song.author.url})` }, { name: "Views:", value: song.views }, { name: "Duration:", value: song.duration }, { name: "Description:", value: song.description.slice(0, 1023) })
        .setImage(song.thumbnail)
    return embed
}

const video_finder = async(query) => {
    const videoResult = await ytSearch(query);
    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
}

const get_duration = async(duration) => {
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

module.exports = async(message, args, botconfig, user_lang_role, cmd) => {
    let user_language = await require("@events/language_load").languages.get(user_lang_role).get("PLAY")
    const voice_channel = message.member.voice.channel;
    if (!voice_channel) return require("@handlers/find_channel_by_name").run({ zprava: user_language.NO_VOICE_CH, roomname: botconfig.find(config => config.name == response).value, message: message });
    const permissions = voice_channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) return require("@handlers/find_channel_by_name").run({ zprava: user_language.NO_PREM, roomname: botconfig.find(config => config.name == response).value, message: message });
    if (!permissions.has("SPEAK")) return require("@handlers/find_channel_by_name").run({ zprava: user_language.NO_PREM, roomname: botconfig.find(config => config.name == response).value, message: message });

    const server_queue = queue.get(message.guild.id);

    if (cmd == "play") {
        if (!args.length) return require("@handlers/find_channel_by_name").run({ zprava: user_language.NO_ARGS, roomname: botconfig.find(config => config.name == response).value, message: message });
        let song = {};

        if (ytdl.validateURL(args[0])) {
            const song_info = await ytdl.getInfo(args[0]);
            song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url, duration: await get_duration(song_info.videoDetails.lengthSeconds), thumbnail: song_info.videoDetails.thumbnails[song_info.videoDetails.thumbnails.length - 1].url, author: { name: song_info.videoDetails.author.name, url: song_info.videoDetails.author.channel_url }, description: song_info.videoDetails.description, views: song_info.videoDetails.viewCount, requested: message.author.username + "#" + message.author.discriminator }
                //console.log(song.author)
        } else {
            const video = await video_finder(args.join(" "));
            if (video) {
                song = { title: video.title, url: video.url, duration: video.duration.timestamp, thumbnail: video.thumbnail, author: video.author, description: video.description, views: video.views, requested: message.author.username + "#" + message.author.discriminator }
            } else {
                require("@handlers/find_channel_by_name").run({ zprava: user_language.ERROR_FINDING, roomname: botconfig.find(config => config.name == response).value, message: message });
            }
        }

        if (!server_queue) {

            const queue_constructor = {
                voice_channel: voice_channel,
                text_channel: message.channel,
                connection: null,
                songs: [],
                loop: false
            }

            queue.set(message.guild.id, queue_constructor);
            queue_constructor.songs.push(song);

            try {
                const connection = await voice_channel.join();
                queue_constructor.connection = connection;
                video_player(message.guild, queue_constructor.songs[0], botconfig, message);
            } catch (err) {
                queue.delete(message.guild.id);
                require("@handlers/find_channel_by_name").run({ zprava: user_language.ERROR_CONECTING, roomname: botconfig.find(config => config.name == response).value, message: message });
                throw err;
            }
        } else {
            server_queue.songs.push(song);
            var embed = new Discord.MessageEmbed()
            require("@handlers/find_channel_by_name").run({ zprava: song_embed(embed, song, 1), roomname: botconfig.find(config => config.name == response).value, message: message });
        }
    } else if (cmd === 'skip') skip_song(message, server_queue);
    else if (cmd === 'stop') stop_song(message, server_queue);
    else if (cmd === 'queue') show_queue(message, server_queue, botconfig);
    else if (cmd === 'loop') toggle_loop(message, server_queue, botconfig);

}

const video_player = async(guild, song, botconfig, message) => {
    const song_queue = queue.get(guild.id);
    //console.log("Video player")
    //console.log(song_queue)
    if (!song) {
        song_queue.voice_channel.leave();
        song_queue.connection.disconnect();
        queue.delete(guild.id);
        return;
    }

    const stream = ytdl(song.url, { filter: "audioonly" });
    await song_queue.connection.play(stream, { seek: 0, volume: 0.5 })
        .on("finish", () => {
            let shifted_song = song_queue.songs.shift();
            if (song_queue.loop) song_queue.songs.push(shifted_song)
            video_player(guild, song_queue.songs[0], botconfig, message);
        });
    var embed = new Discord.MessageEmbed()
    require("@handlers/find_channel_by_name").run({ zprava: song_embed(embed, song, 0), roomname: botconfig.find(config => config.name == response).value, message: message });
}

const skip_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    if (!server_queue) {
        return message.channel.send(`There are no songs in queue 😔`);
    }
    server_queue.connection.dispatcher.end();
}

const stop_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
}

const show_queue = (message, server_queue, botconfig) => {
    if (!server_queue) return
    let songs = server_queue.songs
    let song_list_queue = []
        //console.log(server_queue)
    var embed = new Discord.MessageEmbed()
    embed.setTitle("**Queue**")
    embed.setColor(color.blue)
    songs.forEach((song, i) => {
        if (i == 0) {
            song_list_queue.push(`__Now Playing:__`)
            song_list_queue.push(`[${song.title}](${song.url}) | ` + '`' + `${song.duration} Requested by: ${song.requested}` + '`')
            song_list_queue.push(``)
        } else if (i == 1) {
            song_list_queue.push(`__Up Next:__`)
            song_list_queue.push('`' + i + '.`' + ` [${song.title}](${song.url}) | ` + '`' + `${song.duration} Requested by: ${song.requested}` + '`')
            song_list_queue.push(``)
        } else {
            song_list_queue.push('`' + i + '.`' + ` [${song.title}](${song.url}) | ` + '`' + `${song.duration} Requested by: ${song.requested}` + '`')
            song_list_queue.push(``)
        }
    });
    let state
    if (server_queue.loop) state = ":white_check_mark:";
    else state = ":negative_squared_cross_mark:";
    let last_row = `**${songs.length - 1} songs in queue‎‎‎‎⠀⠀⠀⠀⠀Loop: ${state}**`;
    //console.log(server_queue.loop)
    //console.log(last_row)
    song_list_queue.push(last_row)
    embed.setDescription(song_list_queue.join("\n"))

    require("@handlers/find_channel_by_name").run({ zprava: embed, roomname: botconfig.find(config => config.name == response).value, message: message });
}

const toggle_loop = (message, server_queue, botconfig) => {
    if (!server_queue) return
    let loop = server_queue.loop;

    if (!loop) server_queue.loop = true;
    else server_queue.loop = false;

}