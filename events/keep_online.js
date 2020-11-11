const { bot } = require('../bot');
const fetch = require('node-fetch');

function pingnuti(){
    if(process.env.PING_WEBSITE){
    fetch(process.env.PING_WEBSITE)
    }
    else return console.log("No IP.")
}

bot.on('ready', () => {
    pingnuti()

    setInterval(() => {
        pingnuti()
    }, 600000)
});