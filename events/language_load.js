require("module-alias/register");
require("dotenv").config();
const { bot } = require('@src/bot');
const fs = require("fs")

function get_data() {
    let languages = "./lang/"
    fs.readdir(languages, (err, langs) => {
        langs.forEach(lang => {
            let per_cmd_map = new Map();
            fs.readdir(languages + lang + "/", (err, lang_files) => {
                lang_files.forEach(file => {
                    let file_name = file.split(".")[0].toUpperCase()
                    let file_content = require("." + languages + lang + "/" + file)
                    per_cmd_map.set(file_name, file_content)
                })
                module.exports.languages.set(lang, per_cmd_map)
            })
        })
    })

}


bot.on("ready", () => {
    get_data()
})


module.exports = {
    languages: new Map()
}