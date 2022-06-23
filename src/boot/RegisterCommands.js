const { join } = require("path");
const { client } = require(DClientLoc);
const RegisterHandler = require(join(Functions, "CommandRegisterHandler.js"));

async function promise() {
  let G = client.guilds;

  //Looping through all guilds that client is in
  await G.fetch()
    .then(async (guilds) => {
      for (guild of guilds) {
        //Registering per guild commands
        await RegisterHandler.guild({
          guild: await client.guilds.fetch(guild[0])
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });

  //Registering global commands
  await RegisterHandler.global();
}

module.exports = promise();
