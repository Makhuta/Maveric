module.exports = {
  name: "Help",
  description: "Show description for commands.",
  run(interaction) {
    interaction.reply({
      content: "Test help."
    });
  },
  create({ commands }) {
    commands?.create({
      name: this.name.toLowerCase(),
      description: this.description,
      code: this.run
    });
  }
};
