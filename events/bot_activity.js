const { bot } = require('../bot');
const typ_aktivity = require("../botconfig/bot_activity_types.json")
var typ = 0;


function aktivita() {
    if(typ >= typ_aktivity.length) typ = 0
    bot.user.setActivity(typ_aktivity[typ].text, { type: typ_aktivity[typ].type });
    typ = typ + 1
}



bot.on("ready", () => {

    aktivita()

    setInterval(() => {
        aktivita()
    }, 60000)
})
