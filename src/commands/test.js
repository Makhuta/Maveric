module.exports = {
  name: "Test",
  description: "This is the test command.",
  allowedRoles: ["Admin"],
  helpdescription: "This is the test command.",
  usage: "/test",
  helpname: "Test",
  async run(interaction) {
    interaction.reply({
      content: "This is test."
    });
    let test = await PoolAccess.GetUserFromDatabase({ user: interaction.user });
    console.info(test);
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
