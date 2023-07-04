const { Client, IntentsBitField } = require("discord.js");
const client = new Client({
    intents: new IntentsBitField(32767),
    partials: ["MESSAGE", "CHANNEL", "REACTION", "MESSAGE_CONTENT"]
});

const EventEmitter = require("events");
require("dotenv").config();

//Saving this location into globals
global.DClientLoc = __filename;

class MyEmitter extends EventEmitter { }

//Logging up the client
client.login(process.env.BOT_TOKEN);

module.exports = {
    client: client,
    Maveric: new MyEmitter(),
    run() {
        return new Promise((resolve, reject) => {
            client.on("ready", () => {
                console.info(`\nLogged in as ${client.user.tag}.`);
                resolve();
            });
        });
    }
};