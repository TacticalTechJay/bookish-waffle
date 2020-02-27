module.exports = {
	name: 'search',
    description: 'Search for music to play! Great ikr?',
    category: 'music',
	guildOnly: true,
	testing: false,
	cooldown: 5,
    args: true,
    usage: '<SearchTerm>',
	async execute(message, args, client) {
        if (!message.member.voice.channel) return message.channel.send('You must be in a voice channel!');
        if (message.guild.me.voice.channel) {
            if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send('No.');
        }
	    if (!message.guild.me.hasPermission(['CONNECT', 'SPEAK', 'VIEW_CHANNEL'])) return message.channel.send('I do not have the required permissions to play music');
	    if (!message.member.voice.channel.permissionsFor(message.guild.me).has(['SPEAK', 'CONNECT', 'VIEW_CHANNEL'])) return message.channel.send('I do not have the required permissions to play music');
        const player = await client.manager.get(message.guild.id);
        if (!player) {
            if (!client.queue.get(message.guild.id)) client.createQueue(client, message.guild.id);
            if (client.queue.get(message.guild.id)) {
                if (!args.join(' ')) return client.play(client, message);
            }
        }
        if (args.join(' ').startsWith('http')) {
            return message.channel.send('I can not search links!');
        }
        else {
            client.getSong(`ytsearch:${encodeURIComponent(args.join(' '))}`, message, message.client, true);
        }
	}
};
