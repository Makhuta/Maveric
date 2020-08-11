const Discord = require("discord.js")
const { bot } = require('../bot');
const botconfig = require("../botconfig.json")
const mysqlconfig = require("../mysqlconfig.json")
const mysql = require('mysql')
const random = require('random')
const color = require("../colors.json")

var con = mysql.createConnection({
  host: mysqlconfig.host,
  user: mysqlconfig.user,
  password: mysqlconfig.password,
  database: mysqlconfig.database
});

con.connect(err => {
  if (err) throw err;
  console.log("\nConnected to database!\n")
});

function generateXP() {
  return random.int(10, 30)
}

function zprava(level, typek, message, Discord) {
let embed = new Discord.MessageEmbed()
embed.addFields({name: "Level UP", value: typek + " právě postoupil do levlu " + level + "."})
embed.setColor(color.red)
message.channel.send(embed)
}

bot.on("message", async message => {
  //console.log(bot.users.cache.get)
  if (message.author.bot || message.channel.type === "dm") return;
  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0].toLowerCase();
  let args = messageArray.slice(1);

  con.query(`SELECT * FROM userstats WHERE id = '${message.author.id}'`, (err, rows) => {
    if (err) throw err;

    let sql

    if (rows.length < 1) {
      sql = `INSERT INTO userstats (id, xp) VALUES ('${message.author.id}', ${generateXP()})`
    }
    else {
      var xp = rows[0].xp
      var level = rows[0].level
      var lastmsg = rows[0].last_message
      var cas = Date.now()

      if(Date.now() - lastmsg > 60000){
      xp += generateXP()
      var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
      //console.log(xpToNextLevel)
      if (xp >= xpToNextLevel) {
        level++;
        xp = xp - xpToNextLevel;
        zprava(level, message.author.username, message, Discord)

        sql = `UPDATE userstats SET xp = ${xp} WHERE id = '${message.author.id}'`;
        con.query(sql)
        sql = `UPDATE userstats SET level = ${level} WHERE id = '${message.author.id}'`;
        con.query(sql)
        sql = `UPDATE userstats SET last_message = ${cas} WHERE id = '${message.author.id}'`;
        con.query(sql)
      }
      else {
        sql = `UPDATE userstats SET xp = ${xp} WHERE id = '${message.author.id}'`, `UPDATE userstats SET last_message = ${cas} WHERE id = '${message.author.id}'`;
        con.query(sql)
        sql = `UPDATE userstats SET last_message = ${cas} WHERE id = '${message.author.id}'`;
        con.query(sql)
      }
      }
      else return
      //console.log(level + " " + xp)
    }
   
    //console.log(rows)
  })

  if (!message.content.startsWith(prefix)) return;
  let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)));
  let rle = commandfile.help.accessableby
  //console.log(message.member.roles.cache)

  for (var r = 0; r < rle.length; r++) {
    //console.log(rle[r])
    if (rle[r] === undefined) return;
    if (commandfile && message.member.roles.cache.has(message.guild.roles.cache.find(rla => rla.name === rle[r]).id)) {
      //r === rle.length;
      commandfile.run(bot, message, args, con);
      return
    }
  }


})