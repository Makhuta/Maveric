const client = require(DClientLoc).client;

client.on("messageCreate", (message) => {
  if (message.type == "GUILD_MEMBER_JOIN") return;
  /*console.table([
    ["Nevím 1", "Completed"],
    ["Nevím 2", "Completed"],
    ["Nevím 3", "Completed"],
    ["Nevím 4", "Completed"]
  ]);*/

  //console.info(message);
});
