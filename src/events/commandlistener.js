const { client } = require(DClientLoc);

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (!(commandName in CommandList)) {
    interaction.reply({
      content: "I don´t know how to response to this."
    });

    return console.info(`"${commandName}" is not my command. Universal reply.`);
  }
  CommandList[commandName].code(interaction);
});
