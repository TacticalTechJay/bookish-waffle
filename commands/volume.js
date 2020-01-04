module.exports = {
  name: 'volume',
  description: 'It is a volume command for music.',
  category: 'music',
  args: false,
  guildOnly: true,
  testing: false,
  usage: '[0-150]',
  async execute(message, args, client) {
    const Player = client.manager.get(message.guild.id)
    const queue = client.queue.get(message.guild.id)
    if (!queue) return message.channel.send('Nothing is playing. :thinking:')
    if (!message.member.voice.channel) return message.channel.send('You need to be in the same voice channel as me to use this command.')
    if (message.member.voice.channel !== message.guild.me.voice.channel) return message.channel.send('You are not in the same voice channel as me.')
    if (!args[0]) return message.channel.send(`The current volume is **${Player.state.volume}**. :smiley:`)
    if (isNaN(args[0])) return message.channel.send('Please use actual numbers rather than nonexistent ones.')
    if (args[0] < 0 || args[0] > 150) {
      return message.channel.send('Volume needs to be between 0 and 150.')
    }
    Player.volume(args[0])
    return message.channel.send(`I have changed the volume to ${Player.state.volume}.`)
  }
};
