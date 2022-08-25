const { join } = require("path");
const { client } = require(DClientLoc);
const Handler = require(join(Functions, "command/Handler.js"));

async function promise() {
  let G = client.guilds;
  
  await G.fetch(process.env.SUPPORT_SERVER_ID)
    .then(async (guild) => {
      //Registering support guild commands
      await Handler.guild({ guild });
    })
    .catch((error) => {
      console.error(error);
    });

  //Registering global commands
  await Handler.global();
}

module.exports = promise();
