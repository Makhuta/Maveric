const { bot } = require('../bot');
const fs = require("fs")

function get_data() {
    let languages = "./languages/bot/"
    fs.readdir(languages, (err, language) => {
        language.forEach(jazyk => {
            let language_array = module.exports.languages
            let jazyk_content = require("." + languages + jazyk)
            let jazyk_name = jazyk.split(".")[0]
            language_array.push({ NAME: jazyk_name, FILE_NAME: jazyk, ARRAY: jazyk_content })
            module.exports.languages = language_array
        })
    })

}


bot.on("ready", () => {
    get_data()
})


module.exports = {
    languages: []
}