const { NSBR } = require(DClientLoc);

module.exports = {
  name: "InitMC",
  description: "Initiate member count.",
  allowedRoles: ["Admin", "Moderator"],
  async run(interaction) {
    interaction.reply({
      content: "Done.",
      ephemeral: true
    });
    let sql = `INSERT INTO ${interaction.guild.id}_config (config_name, config_value) VALUES ("COUNTENABLE", "true") ON DUPLICATE KEY UPDATE config_name=VALUES(config_name),config_value=VALUES(config_value);`;
    await PoolAccess.ExecuteQuery({ sql });
    NSBR.emit("InitMemberCounter");
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
