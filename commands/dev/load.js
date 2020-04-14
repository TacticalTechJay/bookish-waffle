module.exports = {
  name: 'load',
  description: 'BOT OWNER ONLY',
  args: true,
  testing: false,
  guildOnly: false,
  cooldown: 0,
  execute(message, args, Client) {
    const commandName = args[0];
    const props = require(`./${commandName}.js`);
    if (!props) return message.channel.send('Unable to load command!');
    Client.commands.set(commandName, props);
    return message.reply(`the command ${commandName} has been loaded.`);
  }
};
