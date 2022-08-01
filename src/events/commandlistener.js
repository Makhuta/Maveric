const { client } = require(DClientLoc);
const { join } = require("path");
const colors = require(join(ColorPaletes, "colors.json"));
const InfoHandler = require(join(Functions, "InfoHandler.js"));
require("dotenv").config();
const { MessageEmbed } = require("discord.js");

function GetCommandsNames() {
  let CMDList = [];
  for (cmdID in CommandList) {
    let cmd = CommandList[cmdID];
    CMDList.push(cmd.Name);
  }
  return CMDList;
}

function GetPrivateCommandsNames() {
  let CMDList = [];
  for (cmdID in CommandList) {
    let cmd = CommandList[cmdID];
    if (cmd.Type == "Testing" || cmd.Type == "Private") {
      CMDList.push(cmd.Name);
    }
  }
  return CMDList;
}

async function RunOwnerCommand({ prefix, command, args, message }) {
  if (prefix != "!") return;
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

  let CMDNamesList = GetPrivateCommandsNames();
  if (!CMDNamesList.includes(command)) return;

  let RequestedCommand = CommandList.find((CMD) => CMD.Name == command);

  if (!require(RequestedCommand.Location).PMEnable && isDM) {
    return console.info(`${command} has disabled DM usage.`);
  }

  require(RequestedCommand.Location).run(message, args);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options, member } = interaction;
  let CMDNamesList = GetCommandsNames();
  //console.info(interaction);

  if (!CMDNamesList.some((CMDName) => CMDName == commandName)) {
    interaction
      .reply({
        content: "I don´t know how to response to this."
      })
      .catch((error) => console.error(error));

    return console.info(`"${commandName}" is not my command. Universal reply.`);
  }

  let RequestedCommand = CommandList.find((CMD) => CMD.Name == commandName);
  let VoteTied = require(RequestedCommand.Location).VoteTied ? require(RequestedCommand.Location).VoteTied : false;
  let hasVoted = await TopGGApi.hasVoted(member.user.id).catch((error) => {
    if (InfoHandler["VoteCheck"] == undefined) {
      InfoHandler["VoteCheck"] = {};
    }
    if (InfoHandler["VoteCheck"][message.author.id] == undefined) {
      InfoHandler["VoteCheck"][message.author.id] = [];
    }

    InfoHandler["VoteCheck"][message.author.id].push({
      ID: message.author.id,
      Username: message.author.username,
      Discriminator: message.author.discriminator,
      Nickname: message.author.nickname ? message.author.nickname : "undefined",
      Bot: message.author.bot,
      Error: error
    });
  })

  if (interaction.guildId == null && !(await require(RequestedCommand.Location).PMEnable)) {
    return interaction.reply({
      content: `You need to send this to server to use ${interaction.commandName}`
    });
  }

  if (VoteTied && !hasVoted) {
    let embed = new MessageEmbed()
      .setTitle(`Missing vote`)
      .setColor(colors.red)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL()
      })
      .addField(`For using ${interaction.commandName} you have to vote for me.`, `[TOP.GG](https://top.gg/bot/${process.env.TOPGGID}/vote)`)
      .setTimestamp();

    return interaction.reply({
      embeds: [embed],
      ephemeral: true
    }).catch((error) => {
      if (InfoHandler["VoteCheck"] == undefined) {
        InfoHandler["VoteCheck"] = {};
      }
      if (InfoHandler["VoteCheck"][interaction.author.id] == undefined) {
        InfoHandler["VoteCheck"][interaction.author.id] = [];
      }
  
      InfoHandler["VoteCheck"][interaction.author.id].push({
        ID: message.author.id,
        Username: message.author.username,
        Discriminator: message.author.discriminator,
        Nickname: message.author.nickname ? message.author.nickname : "undefined",
        ChannelID: interaction.channel.id,
        GuildID: interaction.guildId
      });
    });
  }

  let IsDM = interaction.guildId == null;
  if (IsDM) {
    interaction["url"] = `https://discord.com/channels/@me`;
  } else {
    interaction["url"] = `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id}`;
  }

  await require(RequestedCommand.Location).run(interaction);
});

client.on("messageCreate", async (message) => {
  let prefix = message.content.slice(0, 1);
  let messagecontent = message.content.slice(1).split(" ");
  let command = messagecontent.shift();
  RunOwnerCommand({ prefix, command, args: messagecontent, message });
});
