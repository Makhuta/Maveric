const { NSBR } = require(DClientLoc);

module.exports = {
  name: "InitFL",
  description: "Initiate command force load.",
  allowedRoles: "BotOwner",
  run(interaction) {
    interaction.reply({
      content: "Initiated.",
      ephemeral: true
    });
    NSBR.emit("ConfigInit", interaction.guild);
    NSBR.emit("initForceCommandLoad")
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
