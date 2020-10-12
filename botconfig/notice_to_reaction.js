const { bot } = require('../bot');
const time_delays = require("../botconfig/time_delays.json")
const botconfig = require("../botconfig.json")

const time = time_delays.notice_to_reaction_time

const notice_message = () => {
    const guild = bot.guilds.cache.get(botconfig.guildid);
    guild.roles.cache.forEach(role => {
        if (role.name === "Member") {
            let list = bot.guilds.cache.get(botconfig.guildid)
            list.members.cache.forEach(member => {
                let member_roles = member.roles
                if (!member_roles.cache.has(role.id) && !member.user.bot) {
                    member.send("Vidím že ses připojil na náš server NSBR a stále sis nepřečetl nebo nepotvrdil že sis přečetl pravidla.\n" +
                        "Můžeš tak učinit ve 🔐verify-room🔐.\n" +
                        "Těšíme se na tebe.")
                }

            });
        }
    });
}


bot.on('ready', () => {
    setInterval(() => {
        notice_message()
    }, time)
});