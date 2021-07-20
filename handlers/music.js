require("module-alias/register");
require("dotenv").config();

const ytdl = require("ytdl-core");
const ytpl = require("ytpl")
const ytSearch = require("yt-search");
const Discord = require("discord.js");
const color = require("@colorpaletes/colors.json")
const { getData, getPreview } = require("spotify-url-info");

const queue = new Map();

const response = "MUSIC_ROOM_NAME";

const SPOTIFYregEx = /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track)(?::|\/)((?:[0-9a-zA-Z]){22})/;
const YOUTUBE_PLAYLISTregex = /.*(youtu.be\/|list=)([^#\&\?]*)./;
const MAX_QUEUE_EMBED_NUMBER = 10;

async function song_embed(embed, song, type) {
    let types = ["🎶 Playing 🎶", "Addet to Queue"]
    let video = await video_finder(song.title)
    embed.setTitle(types[type])
    console.log(song)
        .addFields({ name: "Name:", value: `[${song.title}](${song.url})` }, { name: "Author:", value: `[${song.author.name}](${song.author.url})` }, { name: "Views:", value: song.views ? song.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : video.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }, { name: "Duration:", value: song.duration }, { name: "Description:", value: song.description ? song.description.slice(0, 1023) : video.description.slice(0, 1023) })
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

const finding_by_string = async(message, nazev, user_language, botconfig, playlist_array) => {
    let songa = []
    var video = undefined;
    if (nazev) {
        video = await video_finder(nazev);
    }
    if (video) {
        songa.push({ title: video.title, url: video.url, duration: video.duration.timestamp, thumbnail: video.thumbnail, author: video.author, description: video.description, views: video.views, requested: message.author.username + "#" + message.author.discriminator })
    } else {
        require("@handlers/find_channel_by_name").run({ zprava: user_language.ERROR_FINDING, roomname: botconfig.find(config => config.name == response).value, message: message });
    }
    return songa
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
        let url_to_check = args[0]
        let IS_SPOTIFY = url_to_check.match(SPOTIFYregEx)
        let IS_YOUTUBE_PLAYLIST = url_to_check.match(YOUTUBE_PLAYLISTregex)
            //console.log("Before Check:")
            //console.log(IS_SPOTIFY)
            //console.log("Afore Check:")

        if (args.length <= 1 && IS_SPOTIFY) {
            let album_or_track = IS_SPOTIFY[1];
            let spotify_id = IS_SPOTIFY[2]
            if (album_or_track == "track") {
                let SPOTIFY_title = await getPreview(url_to_check)
                console.log(SPOTIFY_title)
                SPOTIFY_title = [SPOTIFY_title.artist, SPOTIFY_title.title].join(" ")
                song = await finding_by_string(message, SPOTIFY_title, user_language, botconfig)
            } else {

            }
        } else {
            if (ytdl.validateURL(args[0])) {
                if (!IS_YOUTUBE_PLAYLIST) {
                    const song_info = await ytdl.getInfo(args[0]);
                    song = [{ title: song_info.videoDetails.title, url: song_info.videoDetails.video_url, duration: await get_duration(song_info.videoDetails.lengthSeconds), thumbnail: song_info.videoDetails.thumbnails[song_info.videoDetails.thumbnails.length - 1].url, author: { name: song_info.videoDetails.author.name, url: song_info.videoDetails.author.channel_url }, description: song_info.videoDetails.description, views: song_info.videoDetails.viewCount, requested: message.author.username + "#" + message.author.discriminator }]
                } else {
                    const playlist_info = (await ytpl(args[0])).items
                    let song_array = [];
                    playlist_info.forEach(s => {
                        song_array.push({ title: s.title, url: s.url, duration: s.duration, thumbnail: s.thumbnails[s.thumbnails.length - 1].url, author: s.author, description: undefined, views: undefined, requested: message.author.username + "#" + message.author.discriminator })
                            //console.log(s)
                    })
                    song = song_array
                        //{ title: video.title, url: video.url, duration: video.duration.timestamp, thumbnail: video.thumbnail, author: video.author, description: video.description, views: video.views, requested: message.author.username + "#" + message.author.discriminator }
                } //console.log(song.author)
            } else {
                song = await finding_by_string(message, args.join(" "), user_language, botconfig)
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
            //console.log(song)
            song.forEach(s => {
                queue_constructor.songs.push(s);
            })

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
            song.forEach(s => {
                server_queue.songs.push(s);
            })
            var embed = new Discord.MessageEmbed()
            require("@handlers/find_channel_by_name").run({ zprava: await song_embed(embed, song, 1), roomname: botconfig.find(config => config.name == response).value, message: message });
        }
    } else if (cmd === 'skip') skip_song(message, server_queue);
    else if (cmd === 'stop') stop_song(message, server_queue);
    else if (cmd === 'queue') show_queue(message, server_queue, botconfig);
    else if (cmd === 'loop') toggle_loop(message, server_queue, botconfig);
    else if (cmd === 'shuffle') shuffle_playlist(message, server_queue, botconfig);

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
            let number_of_users_in_channel = song_queue.voice_channel.members.filter(user => !user.user.bot).size
            if (song_queue.loop) song_queue.songs.push(shifted_song);
            if (number_of_users_in_channel < 1) song_queue.songs = [];
            video_player(guild, song_queue.songs[0], botconfig, message);
        });
    var embed = new Discord.MessageEmbed()
    require("@handlers/find_channel_by_name").run({ zprava: await song_embed(embed, song, 0), roomname: botconfig.find(config => config.name == response).value, message: message });
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
        //console.log(i)
        if (i == 0) {
            song_list_queue.push(`__Now Playing:__`)
            song_list_queue.push(`[${song.title}](${song.url}) | ` + '`' + `${song.duration} Requested by: ${song.requested}` + '`')
            song_list_queue.push(``)
        } else if (i == 1) {
            song_list_queue.push(`__Up Next:__`)
            song_list_queue.push('`' + i + '.`' + ` [${song.title}](${song.url}) | ` + '`' + `${song.duration} Requested by: ${song.requested}` + '`')
            song_list_queue.push(``)
        } else if (i >= MAX_QUEUE_EMBED_NUMBER) {
            let num_of_q_songs = songs.length
            if (num_of_q_songs > MAX_QUEUE_EMBED_NUMBER) {
                if (i == MAX_QUEUE_EMBED_NUMBER) {
                    song_list_queue.push(`${num_of_q_songs - 10} more songs are in Queue.`)
                }
            }
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

const shuffle_playlist = (message, server_queue, botconfig) => {
    if (!server_queue) return
    let shifted_song = server_queue.songs.shift();
    server_queue.songs = server_queue.songs.sort( () => .5 - Math.random() )
    server_queue.songs.unshift(shifted_song)
}