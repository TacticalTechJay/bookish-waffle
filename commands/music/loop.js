module.exports = {
	name: 'loop',
	description: 'Loop your songs in a breeze!',
	args: true,
	usage: '<single/queue/none>',
	execute(message, args, client) {
		const serverQueue = client.queue.get(message.guild.id);
		const op1 = ['single', 'song', 'now', 'np', 's'];
		const op2 = ['queue', 'playlist', 'q'];
		const op3 = ['none', 'disabled', 'disable'];
		if (!serverQueue) return message.channel.send('There is nothing playing, so I won\'t be able to enable looping!');
		if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use this command!');
		if (!message.guild.me.voice.channel) return message.channel.send('I am not in a voice channel. :thinking:');
		else if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You need to be in the same voice channel as me ot use this command!');
		else if (message.member.voice.selfDeaf) return message.channel.send('You need to be undeafened to use something like this.');
		if (op1.includes(args[0].toLowerCase())) serverQueue.looping = 'song';
		else if (op2.includes(args[0].toLowerCase())) serverQueue.looping = 'queue';
		else if (op3.includes(args[0].toLowerCase())) serverQueue.looping = 'disabled';
		else return message.channel.send('You have to choose between `single`, `queue`, or `none`.');
		return message.channel.send(`Loop set to \`${args[0].toLowerCase()}\``);
	}
};
