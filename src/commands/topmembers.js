const { client } = require(DClientLoc);
const { join } = require("path");
const { EmbedBuilder } = require("discord.js");
const colors = require(join(ColorPaletes, "colors.json"));

function timeConverterJSON(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var year = a.getFullYear().toString();
    var month = (a.getMonth() + 1).toString().padStart(2, "0");
    var date = a.getDate().toString().padStart(2, "0");
    var hour = a.getHours().toString().padStart(2, "0");
    var min = a.getMinutes().toString().padStart(2, "0");
    var sec = a.getSeconds().toString().padStart(2, "0");
    var time = { year, month, date, hour, min, sec };
    return time;
}

function nameWithSpaces(name) {
    var subname = name;
    for (let i = name.length - 1; i < 32; i++) {
        subname += " ";
    }
    return subname;
}

module.exports = {
    Name: "TopMembers",
    DescriptionShort: "This is the top members command.",
    DescriptionLong: "Shows top members on the server like oldest profile or oldest member.",
    Usage: "/topmembers",
    Category: "Main",
    IsPremium: false,
    IsVoteDependent: false,
    IsOwnerDependent: false,
    IsAdminDependent: false,
    SupportServerOnly: false,
    PMEnable: false,
    Released: true,
    RequiedUserPermissions: ["SendMessages", "ViewChannel"],
    RequiedBotPermissions: ["SendMessages", "ViewChannel"],
    async create({ commands, permissions, dmEnabled }) {
        let command = await commands?.create({
            name: this.Name.toLowerCase(),
            description: this.DescriptionShort,
            default_permission: permissions,
            dm_permission: dmEnabled
        });
        return command;
    },
    async run(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });

        const { guild, user } = interaction;

        var userList = [];

        for (member of guild.members.cache) {
            member = member[1];
            var createDate = timeConverterJSON(member.user.createdAt);
            var joinDate = timeConverterJSON(member.joinedTimestamp);

            var userIsAuthor = user.id == member.user.id;

            userList.push({
                name: userIsAuthor ? `**${member.user.username}**` : member.user.username,
                id: member.user.id,
                joinDate: userIsAuthor ? `**${joinDate.date + "." + joinDate.month + "." + joinDate.year}**` : joinDate.date + "." + joinDate.month + "." + joinDate.year,
                joinUNIX: new Date(member.joinedTimestamp),
                createDate: userIsAuthor ? `**${createDate.date + "." + createDate.month + "." + createDate.year}**` : createDate.date + "." + createDate.month + "." + createDate.year,
                createUNIX: new Date(member.user.createdAt)
            })
        }

        userList.sort((a, b) => a.joinUNIX - b.joinUNIX);
        const sortedByJoinNames = [];
        const sortedByJoinDates = [];
        for (let i = 0; i < ((userList.length - 1 < 10) ? userList.length - 1 : 10); i++) {
            sortedByJoinNames.push((userList[i].name));
            sortedByJoinDates.push((userList[i].joinDate));
        }


        const sortedByCreateNames = [];
        const sortedByCreateDates = [];
        userList.sort((a, b) => a.createUNIX - b.createUNIX);
        for (let i = 0; i < ((userList.length - 1 < 10) ? userList.length - 1 : 10); i++) {
            sortedByCreateNames.push((userList[i].name));
            sortedByCreateDates.push((userList[i].createDate));
        }


        let embed = new EmbedBuilder()
            .setTitle('List of tom members')
            .setColor(colors.red)
            .addFields(
                {
                    name: 'Join list',
                    value: `${sortedByJoinNames.join("\n")}`,
                    inline: true
                },
                {
                    name: '\u200B',
                    value: `${sortedByJoinDates.join("\n")}`,
                    inline: true
                },
                { name: '\u200B', value: '\u200B' },
                {
                    name: 'Creation list',
                    value: `${sortedByCreateNames.join("\n")}`,
                    inline: true
                },
                {
                    name: '\u200B',
                    value: `${sortedByCreateDates.join("\n")}`,
                    inline: true
                }
            )
            .setTimestamp()
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL()
            });

        return interaction.editReply({
            embeds: [embed]
        });
    }
};
