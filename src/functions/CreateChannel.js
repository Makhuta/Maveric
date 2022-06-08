async function CreateChannel({ name, type, guild, everyoneRole }) {
  return await guild.channels.create(name, {
    type: type,
    permissionOverwrites: [
      {
        id: everyoneRole.id,
        allow: ["VIEW_CHANNEL"],
        deny: ["CONNECT"]
      }
    ]
  });
}

module.exports = CreateChannel;
