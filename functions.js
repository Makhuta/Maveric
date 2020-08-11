const fs = require("fs");

module.exports = (bot) => {
    

    fs.readdir("./events/", (err, files) => {

        if (err) console.log(err);

        let jsfile = files.filter(f => f.split(".").pop() === "js");
        if (jsfile.length <= 0) {
            console.log("There isn't any events to load!");
            return;
        }
        console.log(`Loading ${jsfile.length} events...`)
        jsfile.forEach((f, i) => {
            let pull = require(`./events/${f}`);
            console.log(`${i + 1}: ${f} loaded!`)
        });
    });

    fs.readdir("./commands/", (err, files) => {

        if (err) console.log(err);

        let jsfile = files.filter(f => f.split(".").pop() === "js");
        if (jsfile.length <= 0) {
            console.log("There isn't any command to load!");
            return;
        }
        console.log(`Loading ${jsfile.length} commands...`)
        jsfile.forEach((f, i) => {
            let pull = require(`./commands/${f}`);
            bot.commands.set(pull.help.name, pull);
            pull.help.aliases.forEach(alias => {
                bot.aliases.set(alias, pull.help.name)
                console.log(`${i + 1}: ${f} loaded!`)
            });
        });
    });

};