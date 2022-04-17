module.exports = {
  name: "Test",
  description: "This is the test command.",
  allowedRoles: ["Admin"],
  helpdescription: "This is the test command.",
  usage: "/test",
  helpname: "Test",
  run(interaction) {
    interaction.reply({
      content: "This is test."
    });
    //console.info(CheckList);
  },
  create({ commands }) {
    let command = commands?.create({
      name: this.name.toLowerCase(),
      description: this.description,
      code: this.run
    });
    return command;
  }
};
