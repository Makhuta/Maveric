module.exports = {
    name: "Help",
    description: "This is the help command.",
    helpdescription: "This is the help command.",
    usage: "/help",
    helpname: "Help",
    type: "Global",
    async run(interaction) {
      console.info(GuildsConfigs)
      interaction.reply({
        content: "This is test help command."
      });
    },
    async create({ commands }) {
      let command = await commands?.create({
        name: this.name.toLowerCase(),
        description: this.description
      });
      return command;
    }
  };
  