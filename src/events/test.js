const client = require(DClientLoc).client;

client.on("messageCreate", (message) => {
    if(message.type == "GUILD_MEMBER_JOIN") return
  //console.info(message);
});
