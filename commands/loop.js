module.exports = {
	name: 'loop',
	description: 'Loop your songs in a breeze!',
	category: 'music',
	args: false,
	guildOnly: true,
	testing: false,
	execute(message, args, client) {
		const serverQueue = client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing, so I won\'t be able to enable looping!');
		if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use this command!');
		if (!message.guild.me.voice.channel) return message.channel.send('I am not in a voice channel. :thinking:');
		if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You need to be in the same voice channel as me ot use this command!');
		if (message.member.voice.selfDeaf) return message.channel.send('You need to be undeafened to use something like this.')
		if (serverQueue.looping === true) {
		serverQueue.looping = false;
		return message.channel.send('Loop has been disabled!');
		}
		if (serverQueue.looping === false) {
		serverQueue.looping = true;
		return message.channel.send('Loop has been enabled!');
		}
	}
};
