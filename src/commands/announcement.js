const { join } = require("path");
const { client } = require(DClientLoc);
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");

function timeConverterJSON(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var year = a.getFullYear().toString();
    var month = a.getMonth().toString().padStart(2, "0");
    var date = a.getDate().toString().padStart(2, "0");
    var hour = a.getHours().toString().padStart(2, "0");
    var min = a.getMinutes().toString().padStart(2, "0");
    var sec = a.getSeconds().toString().padStart(2, "0");
    var time = { year, month, date, hour, min, sec };
    return time;
}

module.exports = {
    Name: "Announcement",
    DescriptionShort: "This is the announcement command.",
    DescriptionLong: "This command will let you make and send structurised announcement messages.",
    Usage: "/announcement",
    Category: "Moderation",
    IsPremium: false,
    IsVoteDependent: false,
    IsOwnerDependent: false,
    IsAdminDependent: false,
    SupportServerOnly: false,
    PMEnable: false,
    Released: true,
    RequiedUserPermissions: ["ManageGuild"],
    RequiedBotPermissions: ["SendMessages"],
    async create({ commands, permissions, dmEnabled }) {
        let command = await commands?.create({
            name: this.Name.toLowerCase(),
            description: this.DescriptionShort,
            dmPermission: dmEnabled,
            defaultMemberPermissions: permissions
        });
        return command;
    },
    async run(interaction) {
        const modal = new ModalBuilder()
            .setCustomId("announcement")
            .setTitle("Announcement");

        const today = new Date(Date.now());

        const day = new TextInputBuilder()
            .setCustomId("day")
            .setRequired(false)
            .setLabel("Day (Invalid number will result in today)")
            .setMinLength(1)
            .setMaxLength(2)
            .setPlaceholder("Number between 1-31.")
            .setValue(today.getDate().toString())
            .setStyle(TextInputStyle.Short);


        const month = new TextInputBuilder()
            .setCustomId("month")
            .setRequired(false)
            .setLabel("Month (Invalid number will result in today)")
            .setMinLength(1)
            .setMaxLength(2)
            .setPlaceholder("Number between 1-12.")
            .setValue((today.getMonth() + 1).toString().padStart(2, "0"))
            .setStyle(TextInputStyle.Short);

        const year = new TextInputBuilder()
            .setCustomId("year")
            .setRequired(false)
            .setLabel("Year (Invalid number will result in today)")
            .setMinLength(4)
            .setMaxLength(4)
            .setPlaceholder("Any four-digit year.")
            .setValue(today.getFullYear().toString().padStart(2, "0"))
            .setStyle(TextInputStyle.Short);

        const title = new TextInputBuilder()
            .setCustomId("title")
            .setRequired(true)
            .setLabel("Title")
            .setMinLength(1)
            .setPlaceholder("Message title")
            .setValue("Announcement")
            .setStyle(TextInputStyle.Short);

        const message = new TextInputBuilder()
            .setCustomId("message")
            .setRequired(true)
            .setLabel("Message")
            .setMinLength(1)
            .setPlaceholder("Announcement message.")
            .setStyle(TextInputStyle.Paragraph);

        modal.addComponents(
            new ActionRowBuilder().addComponents(day),
            new ActionRowBuilder().addComponents(month),
            new ActionRowBuilder().addComponents(year),
            new ActionRowBuilder().addComponents(title),
            new ActionRowBuilder().addComponents(message)
        );

        interaction.showModal(modal);
    },
    async modal(interaction) {
        const items = interaction.components;
        const components = {
            day: items[0].components[0].value,
            month: items[1].components[0].value,
            year: items[2].components[0].value,
            title: items[3].components[0].value,
            message: items[4].components[0].value
        }
        const embed = new EmbedBuilder()
            .setAuthor({
                name: components.title,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(components.message)
            .setTimestamp(new Date(`${components.month}/${components.day}/${components.year} 00:00:00`))


        console.info(components);
        await interaction.reply({ embeds: [embed] })
    }
};
