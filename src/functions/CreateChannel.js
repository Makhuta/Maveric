async function CreateChannel({ name, type, guild, everyoneRole, BotID }) {
  return await guild.channels.create(name, {
    type: type,
    permissionOverwrites: [
      {
        id: everyoneRole.id,
        allow: ["VIEW_CHANNEL"],
        deny: ["CONNECT"]
      },
      {
        id: BotID.id,
        allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "CONNECT"],
        deny: []
      }
    ]
  });
}

module.exports = CreateChannel;
