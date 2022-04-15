const { NSBR } = require(DClientLoc);

module.exports = {
  name: "InitMC",
  description: "Initiate member count.",
  allowedRoles: ["Admin", "Moderator"],
  run(interaction) {
    interaction.reply({
      content: "Done.",
      ephemeral: true
    });
    NSBR.emit("InitMemberCounter")
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
