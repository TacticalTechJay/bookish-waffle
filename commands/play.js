module.exports = {
    name: 'play',
    description: 'Play music in a voice channel you\'re in... at high quality. :sunglasses:',
    category: 'music',
    args: true,
    guildOnly: true,
    testing: false,
    cooldown: 5,
    aliases: ['p'],
    usage: '<SongURL/SearchString>',
    async execute(message, args, client) {
        if (!message.member.voice.channel) return message.channel.send('You must be in a voice channel!');
        if (message.guild.me.voice.channel) {
            if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You need to be in the same voice channel as me to use this command.');
        }
		if (!message.guild.me.hasPermission(['SPEAK', 'CONNECT', 'VIEW_CHANNEL'])) return message.channel.send('I do not have the required permissions to play music');
        if (!message.member.voice.channel.permissionsFor(message.guild.me).has(['SPEAK', 'CONNECT', 'VIEW_CHANNEL'])) return message.channel.send('I do not have the required permisssions to play music');
        if (message.member.voice.selfDeaf) return message.channel.send('You need to be undeafened to use something like this.');
        if (!client.manager.players.get(message.guild.id)) {
            if (!client.queue.get(message.guild.id)) client.createQueue(message.guild.id, message.channel.id);
            if (client.queue.get(message.guild.id)) {
                if (!args.join(' ')) return client.play(message);
            }
        }
        if (args.join(' ').startsWith('http')) {
            client.getSong(`${args.join(' ')}`, message, false);
        }
        else {
            client.getSong(`ytsearch:${encodeURIComponent(args.join(' '))}`, message, false);
        }
    }
};
