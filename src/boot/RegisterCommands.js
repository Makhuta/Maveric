const { join } = require("path");
const { client } = require(DClientLoc);
const RegisterHandler = require(join(Functions, "CommandRegisterHandler.js"));

async function promise() {
  let G = client.guilds;

  await G.fetch().then(async (guilds) => {
    for (guild of guilds) {
      await RegisterHandler.guild({
        guild: await client.guilds.fetch(guild[0])
      });
    }
  });

  await RegisterHandler.global();
}

module.exports = promise();
