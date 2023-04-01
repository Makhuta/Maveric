const { client } = require(DClientLoc);
const { join } = require("path");
const colors = require(join(ColorPaletes, "colors.json"));
const InfoHandler = require(join(Functions, "placeholders/InfoHandler.js"));
require("dotenv").config();
const { EmbedBuilder } = require("discord.js");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  //await interaction.deferReply();

  const { commandName, user, guildId } = interaction;
  let IsDM = guildId == null;
  let CMDNamesList = Object.keys(CommandList);

  if (!CMDNamesList.some((CMDName) => CMDName == commandName)) {
    interaction
      .reply({
        content: "I don´t know how to response to this."
      })
      .catch((error) => console.error(error));

    return console.info(`"${commandName}" is not my command. Universal reply.`);
  }

  let ThisGuildConfig;

  if (IsDM) {
    ThisGuildConfig = { BOTADVERTISEMENT: "false" };
  } else {
    ThisGuildConfig = GuildsConfigs[guildId].config;
  }

  let BotAdvertisementEnabled = ThisGuildConfig.BOTADVERTISEMENT == "true";

  let RequestedCommand = CommandList[commandName];
  let VoteTied = RequestedCommand.IsVoteDependent;
  if (IsDM && !RequestedCommand.PMEnable) {
    return interaction.reply({
      content: `You need to send this to server to use ${interaction.commandName}`
    });
  }

  let hasVoted;

  if (VoteTied) {
    hasVoted = true;

    console.info(
      `User: ${user.username}#${user.discriminator} want to run vote tied command: ${commandName}.\nHas voted: ${hasVoted}\nBot Advertisement enabled: ${BotAdvertisementEnabled}`
    );
  }

  if (VoteTied && !hasVoted && !BotAdvertisementEnabled) {
    let embed = new EmbedBuilder()
      .setTitle(`Missing vote`)
      .setColor(colors.red)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({ name: `For using ${interaction.commandName} you have to vote for me.`, value: `[TOP.GG](https://top.gg/bot/${process.env.TOPGGID}/vote)` })
      .setTimestamp();

    return interaction
      .reply({
        embeds: [embed],
        ephemeral: true
      })
      .catch((error) => {
        if (InfoHandler["EmbedMessage"] == undefined) {
          InfoHandler["EmbedMessage"] = {};
        }
        if (InfoHandler["EmbedMessage"][user.id] == undefined) {
          InfoHandler["EmbedMessage"][user.id] = [];
        }

        InfoHandler["EmbedMessage"][user.id].push({
          ID: user.id,
          Username: user.username,
          Discriminator: user.discriminator,
          Nickname: user.nickname ? user.nickname : "undefined",
          ChannelID: interaction.channel.id,
          GuildID: guildId
        });
      });
  }

  if (IsDM) {
    interaction["url"] = `https://discord.com/channels/@me`;
  } else {
    interaction["url"] = `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`;
  }

  if (!IsDM) {
    let commandHasRequiredPermissions = [];
    for (BotPermission of RequestedCommand.RequiedBotPermissions) {
      commandHasRequiredPermissions.push({ Name: BotPermission, Has: interaction.guild.members.me.permissions.has(PossiblePermissions[BotPermission]) });
    }

    if (commandHasRequiredPermissions.some((element) => !element.Has))
      return interaction.reply({
        content: `I don't have permission to perform this task.\nNeeded permission/s: ${(function () {
          let CMDsNoPerm = commandHasRequiredPermissions.filter((e) => !e.Has);
          let ReqPerms = [];
          for (CMDNoPerm of CMDsNoPerm) {
            ReqPerms.push(CMDNoPerm.Name);
          }
          return ReqPerms.join(", ");
        })()}`
      });
  }

  try {
    await require(RequestedCommand.Path).run(interaction);
  } catch (InteractionError) {
    console.error(InteractionError);
    if (interaction.deferred) {
      interaction.editReply({
        content: `There was an error while processing your command.\nPlease contact support\n[${client.user.username} support](${process.env.SUPPORT_SERVER_INVITE})`
      });
    } else {
      interaction.reply({
        content: `There was an error while processing your command.\nPlease contact support\n[${client.user.username} support](${process.env.SUPPORT_SERVER_INVITE})`
      });
    }

    if (InfoHandler["InteractionExecute"] == undefined) {
      InfoHandler["InteractionExecute"] = {};
    }
    if (InfoHandler["InteractionExecute"][RequestedCommand.Name.toLowerCase()] == undefined) {
      InfoHandler["InteractionExecute"][RequestedCommand.Name.toLowerCase()] = [];
    }

    InfoHandler["InteractionExecute"][RequestedCommand.Name.toLowerCase()].push({
      Command: RequestedCommand,
      Error: InteractionError
    });
  }
});
