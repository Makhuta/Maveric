require("module-alias/register");
require("dotenv").config();
const fs = require("fs")
const { MessageEmbed } = require("discord.js")
const { bot } = require("@src/bot")
const xp_stats = require("@configs/xp_stats.json")
const database_access = require("@handlers/database_access")

const name = "language"
const accessableby = ["Member"]
const aliases = ["lang"]
const response = "COMMAND_ROOM_NAME";
const category = ["Basic", "All"]

const LANG_PREFIX = "Language:"
const emojis_list = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

const user_setup = new Map();

const all_languages_with_prefix = new Promise((resolve, reject) => {
    let languages = "./lang/"
    fs.readdir(languages, (err, langs) => {
        let langs_with_prefix = []
        langs.forEach(one_lang => {
            langs_with_prefix.push(LANG_PREFIX + one_lang)
        })
        resolve(langs_with_prefix)
    })
})

const remove_all_roles_from_user = async(ROLE_FROM_BOT, target) => {
    if (ROLE_FROM_BOT) {
        ROLE_FROM_BOT.forEach(role => {
            if (target.roles.cache.has(role.id)) {
                target.roles.remove(role.id)
            }
        })
    }
}

const choose_lang_embed = (ROLE_FROM_BOT, user_language, target) => {
    let used_emojis = []
    let lang_list = ROLE_FROM_BOT.map(function(obj) {
        return obj.name.split(":")[1]
    })
    lang_list.forEach((lang_name, i) => {
        let emoji = get_emoji_from_number(i)
        lang_list[i] = emoji + " " + lang_name
        used_emojis.push({ emoji, lang_name })
    })
    lang_list = lang_list.join("\n")
    let embed = new MessageEmbed()
        .setAuthor(user_language.TITLE.replace("&USER", `${target.user.username}#${target.user.discriminator}`))
        .setDescription(lang_list)
        .setTitle(user_language.AUTHOR)
        .setColor("RANDOM")


    return { embed, used_emojis }
}

const get_emoji_from_number = (number) => {
    if (number > emojis_list.length) number = emojis_list.length
    return emojis_list[number]
}

module.exports.run = async(message, args, botconfig, user_lang_role) => {
    const constructor = {
        target: message.member,
        lang_message: null,
        used_emojis: null,
        ROLE_FROM_BOT: null
    }
    let target = message.member
    let user_language = require("@events/language_load").languages.get(user_lang_role).get("LANGUAGE")
    let language_roles_names = await all_languages_with_prefix

    let per_user_setup = user_setup.get(target.id)

    if (!per_user_setup) {
        user_setup.set(target.id, constructor)
        per_user_setup = user_setup.get(target.id)
    } else {
        if (!per_user_setup.lang_message.deleted) {
            per_user_setup.lang_message.delete();
        }
        per_user_setup.lang_message = null;
    }


    let ROLE_FROM_BOT = message.guild.roles.cache.filter(r => r.name.split(":")[0] + ":" === LANG_PREFIX);
    let choosing_lang_embed = choose_lang_embed(ROLE_FROM_BOT, user_language, target);
    let lang_embed = choosing_lang_embed.embed;
    let used_emojis = choosing_lang_embed.used_emojis.map(function(obj) {
        return obj.emoji
    })

    let lang_message = await require("@handlers/find_channel_by_name").run({ zprava: lang_embed, roomname: botconfig.find(config => config.name == response).value, message: message });
    used_emojis.forEach(async emoji => {
        await lang_message.react(emoji)
    })
    per_user_setup.lang_message = lang_message
    per_user_setup.used_emojis = choosing_lang_embed.used_emojis
    per_user_setup.ROLE_FROM_BOT = ROLE_FROM_BOT

}

bot.on("messageReactionAdd", async(reaction, user) => {
    if (!user) return;
    if (user.bot) return;
    if (!reaction.message.channel.guild) return;
    let per_user_setup = user_setup.get(user.id)
    if (!per_user_setup) return reaction.users.remove(user.id)
    if (reaction.message.id != per_user_setup.lang_message.id) return;
    let used_emojis_json = per_user_setup.used_emojis
    let used_emojis = used_emojis_json.map(function(obj) {
        return obj.emoji
    })
    if (used_emojis.includes(reaction.emoji.name)) {
        let role_name_from_reaction = used_emojis_json.find(selected_emoji => selected_emoji.emoji == reaction.emoji.name).lang_name
        let requested_role = per_user_setup.ROLE_FROM_BOT.find(role => role.name.split(":")[1] == role_name_from_reaction)
        await remove_all_roles_from_user(per_user_setup.ROLE_FROM_BOT, per_user_setup.target);
        per_user_setup.target.roles.add(requested_role.id)
        per_user_setup.lang_message.delete();
        user_setup.delete(user.id)
    }

})

module.exports.help = {
    name: name,
    accessableby: accessableby,
    aliases: aliases,
    category: category
}