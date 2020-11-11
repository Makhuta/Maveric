const fs = require("fs");

module.exports = {
    async run(hodnoty) {
        let token = hodnoty.token
        await require(`./${token}`).run(hodnoty)
    }
}