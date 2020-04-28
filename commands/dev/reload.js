module.exports = {
  name: 'reload',
  description: 'BOT OWNER ONLY',
  testing: false,
  cooldown: 0,
  args: false,
  group: 'trusted',
  async execute(message, args, client) {
    client.commands.filter(c => c.category !== 'nsfw').forEach(c => {
      delete require.cache[require.resolve(`../${c.category}/${c.name}.js`)];
    });
    client.commands = new (require('discord.js').Collection)();
    await client.utils.loaders.loadCommands(client);
    return message.reply('all commands *should* be reloaded.');
  }
};
