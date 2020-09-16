const Discord = require("discord.js");
const botconfig = require("../botconfig.json")
const color = require("../colors.json")
const fs = require("fs");
const { createCanvas, loadImage, Canvas } = require("canvas");
const { join } = require("path");
const { createGzip } = require("zlib");
const canvasxp = require("../funkce/canvasxp")

const name = "xp"
const description = `Vypíše počet XP`
const usage = `${botconfig.prefix}xp`
const accessableby = ["Member"]
const aliases = [""]


module.exports.run = async (bot, message, args, con) => {
    let target = message.mentions.users.first() || message.guild.members.cache.get(args[1]) || message.author;


    con.query(`SELECT * FROM userstats WHERE id = '${target.id}'`, (err, rows) => {
        if (err) throw err;
        var test = con.query(`SELECT id FROM userstats`, (err, rows))
        var test_values = test.values
        var test_level = []
        var test_xp = []

        con.query("SELECT id, level, xp FROM userstats", function (err, result, fields) {
            if (err) throw err;
            var aray = JSON.stringify(result)
            var araysplit = aray.split(",")
            //console.log(aray)
            /*Object.keys(result).forEach(function(key) {
                var row = result[key]
                console.log(id);
            })*/


        });

        /* var queries = {
             users: 'SELECT * FROM userstats'
         };
         
         const getList = (queryName, queryParams) => {
             return new Promise(function(resolve, reject){
                 con.query(queries[queryName], queryParams, function(id, err, result, fields){
                     if (!err) resolve(JSON.parse(JSON.stringify(result))); // Hacky solution
                     else reject(err);
                     //console.log(resolve(JSON.parse(JSON.stringify(result))))
                 });
             });
         };
 
         getList("id")*/

        if (!rows[0]) return message.channel.send("This user has no XP on record.")
        let xp = rows[0].xp
        let level = rows[0].level
        var xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100
        canvasxp.execute(xp, level, target, message, xpToNextLevel)

    })
}


module.exports.help = {
    name: name,
    description: description,
    usage: usage,
    accessableby: accessableby,
    aliases: aliases
}