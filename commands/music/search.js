const Utils = require('../../utils/index.js')
module.exports = {
	name: 'search',
	description: 'Search for music to play! Great ikr?',
	testing: false,
	cooldown: 5,
	args: true,
	usage: '<SearchTerm>',
	async execute(message, args, client) {
		if (!message.member.voice.channel) return message.channel.send('You must be in a voice channel!');
		else if (message.member.voice.selfDeaf) return message.channel.send('You need to be undeafened to use something like this.');
		if (message.guild.me.voice.channel) {
			if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send('You need to be in the same voice channel as me to use this command.');
		}
		if (!message.guild.me.hasPermission(['CONNECT', 'SPEAK', 'VIEW_CHANNEL'])) return message.channel.send('I do not have the required permissions to play music');
		if (!message.member.voice.channel.permissionsFor(message.guild.me).has(['SPEAK', 'CONNECT', 'VIEW_CHANNEL'])) return message.channel.send('I do not have the required permissions to play music');
		const player = await client.manager.players.get(message.guild.id);
		if (!player || !client.queue.get(message.guild.id)) Utils.music.createQueue(message.guild.id, message.channel.id, client);
		if (args.join(' ').startsWith('http')) return message.channel.send('I can not search links!');
		else Utils.music.getSong(`ytsearch:${encodeURIComponent(args.join(' '))}`, message, true, client);
	}
};
