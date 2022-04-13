const client = require(DClientLoc).client;
var typ = 0;

const typ_aktivity = [
    "Managing server."
]


function aktivita() {
    if(typ >= typ_aktivity.length) typ = 0
    client.user.setActivity(typ_aktivity[typ] , { type: "PLAYING" });
    typ = typ + 1
}



client.on("ready", () => {

    aktivita()

    setInterval(() => {
        aktivita()
    }, 60000)
})