const { client } = require(DClientLoc);

async function CreateChannel({ name, type, guild, everyoneRole, BotID }) {
  return await guild.channels.create(name, {
    type: type,
    permissionOverwrites: [
      {
        id: everyoneRole.id,
        allow: ["VIEW_CHANNEL"],
        deny: ["CONNECT", "SEND_MESSAGES"]
      },
      {
        id: client.user.id,
        allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "CONNECT", "SEND_MESSAGES"],
        deny: []
      }
    ]
  });
}

module.exports = CreateChannel;
