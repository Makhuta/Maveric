require("module-alias/register");
require("dotenv").config();
const { bot } = require('@src/bot');

const usersMap = new Map();
const LIMIT = 5;
const TIME = 10000;
const DIFF = 2000;
const MUTE_TIME = 300000;

bot.on("message", msg => {
    if (msg.author.bot) return;
    const role = msg.guild.roles.cache.filter(rle => rle.name == "Muted").first()
    let isMuted = msg.member.roles.cache.has(role.id)
    if (isMuted) {
        msg.delete();
    } else

    {
        if (usersMap.has(msg.author.id)) {
            const userData = usersMap.get(msg.author.id)
            const { lastMessage, timer } = userData
            const difference = msg.createdTimestamp - lastMessage.createdTimestamp;
            let msgCount = userData.msgCount
            if (difference > DIFF) {
                clearTimeout(timer)
                userData.msgCount = 1;
                userData.lastMessage = msg
                userData.timer = setTimeout(() => {
                    usersMap.delete(msg.author.id)
                }, TIME)
                usersMap.set(msg.author.id, userData);
            } else {
                ++msgCount;
                if (parseInt(msgCount) === LIMIT) {

                    msg.member.roles.add(role)
                    msg.author.send("You have been muted.")
                    setTimeout(() => {
                        msg.member.roles.remove(role)
                    }, MUTE_TIME)

                } else {
                    userData.msgCount = msgCount;
                    usersMap.set(msg.author.id, userData)
                }
            }
        } else {
            let fn = setTimeout(() => {
                usersMap.delete(msg.author.id)
            }, TIME);

            usersMap.set(msg.author.id, {
                msgCount: 1,
                lastMessage: msg,
                timer: fn
            });
        }
    }


})