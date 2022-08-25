const { client } = require(DClientLoc);
const { join } = require("path");
const colors = require(join(ColorPaletes, "colors.json"));
const JSONFilter = require(join(Functions, "global/JSONFilter.js"));
const InfoHandler = require(join(Functions, "placeholders/InfoHandler.js"));
require("dotenv").config();
const PermissionsList = require(join(Configs, "PermissionsList.json"));
const { EmbedBuilder } = require("discord.js");

async function RunOwnerCommand({ prefix, command, args, message }) {
  console.info(prefix);
  if (prefix != "!") return;
  console.info(message);

  let isDM;

  let where;

  if (message.guildId == null) {
    where = "through DM";
    isDM = true;
  } else {
    where = `from Guild: ${message.guildId}`;
    isDM = false;
  }

  if (message.author.id != process.env.OWNER_ID) {
    if (InfoHandler["CommandUsage"] == undefined) {
      InfoHandler["CommandUsage"] = {};
    }
    if (InfoHandler["CommandUsage"][message.author.id] == undefined) {
      InfoHandler["CommandUsage"][message.author.id] = [];
    }

    InfoHandler["CommandUsage"][message.author.id].push({
      ID: message.author.id,
      Username: message.author.username,
      Discriminator: message.author.discriminator,
      Nickname: message.author.nickname ? message.author.nickname : "undefined",
      Bot: message.author.bot,
      Command: command,
      Arguments: args
    });
    return;
  }

  let CMDNamesList = JSONFilter({ JSONObject: CommandList, SearchedElement: "IsOwnerDependent", ElementValue: true });
  if (!CMDNamesList.includes(command)) return;

  let RequestedCommand = CommandList.find((CMD) => CMD.Name == command);

  if (!require(RequestedCommand.Location).PMEnable && isDM) {
    return console.info(`${command} has disabled DM usage.`);
  }

  require(RequestedCommand.Location).run(message, args);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options, member, user, guildId } = interaction;
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
  if (IsDM && RequestedCommand.PMEnable) {
    return interaction.reply({
      content: `You need to send this to server to use ${interaction.commandName}`
    });
  }

  let hasVoted;

  if (VoteTied) {
    hasVoted = await TopGGApi.hasVoted(user.id).catch((error) => {
      if (InfoHandler["VoteCheck"] == undefined) {
        InfoHandler["VoteCheck"] = {};
      }
      if (InfoHandler["VoteCheck"][user.id] == undefined) {
        InfoHandler["VoteCheck"][user.id] = [];
      }

      InfoHandler["VoteCheck"][user.id].push({
        ID: user.id,
        Username: user.username,
        Discriminator: user.discriminator,
        Nickname: user.nickname ? user.nickname : "undefined",
        Bot: user.bot,
        Error: error,
        BotAdvertisementEnabled
      });
    });

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

  let commandHasRequiredPermissions = [];
  for (BotPermission of RequestedCommand.RequiedBotPermissions) {
    commandHasRequiredPermissions.push({ Name: BotPermission, Has: interaction.guild.members.me.permissions.has(PermissionsList[BotPermission]) });
  }

  if (commandHasRequiredPermissions.some((element) => !element.Has))
    return interaction.reply({
      content: `Don't have permission to perform this task.\nNeeded permission/s: ${(function () {
        let CMDsNoPerm = commandHasRequiredPermissions.filter((e) => !e.Has);
        let ReqPerms = [];
        for (CMDNoPerm of CMDsNoPerm) {
          ReqPerms.push(CMDNoPerm.Name);
        }
        return ReqPerms.join(", ");
      })()}`
    });

  await require(RequestedCommand.Path).run(interaction);
});
