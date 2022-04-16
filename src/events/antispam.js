const { client } = require(DClientLoc);

const MessageLimit = 5; //5
const CooldownTime = 10000; //10000
const TimeOutLength = 60000; //60000
const WarningLimitKick = 5; //5

function UserConstructor({ user, Antispam }) {
  this.ID = user.id;
  if (Antispam[this.ID]?.MessageCount != undefined) {
    this.MessageCount = Antispam[this.ID]?.MessageCount + 1;
  } else {
    this.MessageCount = 1;
  }
  if (Antispam[this.ID]?.WarningCount == undefined) {
    this.WarningCount = 0;
  } else {
    this.WarningCount = Antispam[this.ID].WarningCount;
  }
  if (Antispam[this.ID]?.CountDown != undefined) {
    clearInterval(Antispam[this.ID]?.CountDown);
  }

  this.CountDown = setInterval(function () {
    if (Antispam[user.id].MessageCount <= 0) {
      Antispam[user.id].MessageCount = 0;
      clearInterval(Antispam[user.id].CountDown);
      return;
    }
    Antispam[user.id].MessageCount--;
  }, CooldownTime);
}

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  const guild = message.guild;
  var ThisGuildItems = BotGuilds.get(guild.id);
  if (ThisGuildItems == undefined) return;
  if (ThisGuildItems.antispam == undefined) {
    ThisGuildItems["antispam"] = {};
  }
  var Antispam = ThisGuildItems.antispam;
  const MessageAuthor = message.author;
  const Suspect = new UserConstructor({ user: MessageAuthor, Antispam });
  Antispam[Suspect.ID] = Suspect;

  let member = guild.members.cache.get(Suspect.ID);
  if (Antispam[Suspect.ID].MessageCount > MessageLimit) {
    member
      .timeout(TimeOutLength, "Spamming too much.")
      .catch((error) => console.error(error));
    Antispam[Suspect.ID].WarningCount = Antispam[Suspect.ID].WarningCount + 1;
  }

  if (Antispam[Suspect.ID].WarningCount > WarningLimitKick) {
    member
      .kick("Kicked due to his/her spamming.")
      .catch((error) => console.error(error));
  }
});
