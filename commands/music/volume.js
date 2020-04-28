module.exports = {
  name: 'volume',
  description: 'It is a volume command for music.',
  args: false,
  testing: false,
  usage: '[0-150]',
  async execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);
    const queue = client.queue.get(message.guild.id);
    if (!queue) return message.channel.send('Nothing is playing. :thinking:');
    if (!message.member.voice.channel) return message.channel.send('You need to be in the same voice channel as me to use this command.');
    else if (message.member.voice.channel !== message.guild.me.voice.channel) return message.channel.send('You are not in the same voice channel as me.');
		else if (message.member.voice.selfDeaf) return message.channel.send('You need to be undeafened to use something like this.');
    if (!args[0]) return message.channel.send(`The current volume is ${player.state.volume}%.`);
    if (queue.locked && queue.songs[0].requester.id !== message.author.id) return message.channel.send('This queue is currently locked to the requester of the current song.');
    if (isNaN(args[0])) return message.channel.send('Please use actual numbers rather than nonexistent ones.');
    if (args[0] < 0 || args[0] > 150) {
      return message.channel.send('Volume needs to be between 0 and 150.');
    }
    await player.volume(args[0]);
    return message.channel.send(`I have changed the volume to ${player.state.volume}%`);
  }
};
