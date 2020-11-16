const fs = require("fs");

module.exports = {
    async run(hodnoty) {
        let token = hodnoty.folder + "/" + hodnoty.token
        await require(`./${token}`).run(hodnoty)
    }
}