const fs = require("fs");
const path = require("path")

module.exports = {
    run(hodnoty) {
        let res = hodnoty.res
        let view_hbs = hodnoty.view_hbs
        let title = hodnoty.title
        let host_value = hodnoty.host_value
        let command_folder = path.join(__dirname, "../../../", "commands")
        let command_list = fs.readdirSync(command_folder)
        let commands = []
        command_list.forEach(c => {
            let file_to_require = command_folder + "/" + c
            let command_name = require(file_to_require).help.name
            let command_description = require(file_to_require).help.description
            let command_usage = require(file_to_require).help.usage
            let command_accessableby = require(file_to_require).help.accessableby
            let command_aliases = require(file_to_require).help.aliases
            command_name = command_name[0].toUpperCase() + command_name.slice(1)
            if(command_description.length == 0) command_description = "Tento příkaz nemá žádný popis."
            if(command_aliases.length == 0) command_aliases = "Tento příkaz nemá žádný alias."
            commands.push({ name: command_name, command_description: command_description, command_usage: command_usage, command_accessableby: command_accessableby, command_aliases: command_aliases })
        })

        res.render(view_hbs, { title: title, host_value: host_value, commands: commands });
    }
}