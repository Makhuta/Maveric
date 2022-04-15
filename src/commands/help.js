module.exports = {
  name: "Help",
  description: "Show description for commands.",
  run(interaction) {
    interaction.reply({
      content: "Test help."
    });
  },
  create({ commands }) {
    let command = commands?.create({
      name: this.name.toLowerCase(),
      description: this.description,
      code: this.run
    });
    return command
  }
};
