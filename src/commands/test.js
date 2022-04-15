module.exports = {
  name: "Test",
  description: "This is the test command.",
  run(interaction) {
    interaction.reply({
      content: "This is test."
    });
    console.info(CheckList);
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
