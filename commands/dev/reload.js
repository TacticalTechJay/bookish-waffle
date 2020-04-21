module.exports = {
  name: 'reload',
  description: 'BOT OWNER ONLY',
  testing: false,
  cooldown: 0,
  args: false,
  group: 'trusted',
  execute(message, args, client) {
    if(!args || args.size < 1) return message.reply('you must provide a command name to reload.');
    const { walk } = require('walk');
    const { resolve } = require('path');
    const commandsReload = walk(`${process.env}`)
    client.commands = new (require('discord.js').Collection)();
    commandsReload.on('file', (root, stats, next) => {
      console.log(root);
      const command = require(`${resolve(root)}${stats.name}`);
      command.category = root.split('/')[2] || command.category || 'etc';
      client.commands.set(command.name, command);
      next();
    });
    return message.reply(`all commands *should* be reloaded.`);
  }
};
