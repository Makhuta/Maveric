//Must be on the top of every code for accessing folders more easilly
require("module-alias/register");
require("dotenv").config();


const { bot } = require('@src/bot');

bot.login(process.env.BOT_TOKEN);
bot.setMaxListeners(0);

bot.on("ready", () => {
    let guild = bot.guilds.cache.first();
    const mute_role = guild.roles.cache.filter(rle => rle.name == "Muted").first()
    let role = guild.roles.cache.find(r => r.name == "Member");
    let role_id = role.id;
    let all_users = guild.members.cache.filter(user => !user.user.bot).filter(roles => !roles._roles.includes(role_id))
    let all_mute_users = guild.members.cache.filter(user => !user.user.bot).filter(roles => roles._roles.includes(mute_role.id))
    all_users.forEach(user => {
        user.roles.add(role).catch(console.error);
    })
    all_mute_users.forEach(user => {
        user.roles.remove(mute_role).catch(console.error);
    })
    console.log(bot.user.username + " is Ready!")
})