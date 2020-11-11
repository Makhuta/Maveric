const fs = require("fs");

module.exports = {
    async run(hodnoty) {
        let token = hodnoty.token
        console.log("Signpost")
        await require(`./${token}`).run(hodnoty)
    }
}