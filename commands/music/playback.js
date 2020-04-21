module.exports = {
    name: 'playback',
    description: 'Enable and disable playback notifications',
    args: false,
    aliases: ['pb', 'pbn', 'notif', 'ntf', 'n'],
    async execute(message, args, client) {
        const serverQueue = client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing, so I won\'t be able to disable playback notifications!');
		if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use this command!');
		if (!message.guild.me.voice.channel) return message.channel.send('I am not in a voice channel. :thinking:');
		else if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You need to be in the same voice channel as me ot use this command!');
		else if (message.member.voice.selfDeaf) return message.channel.send('You need to be undeafened to use something like this.');
        if (serverQueue.pb) serverQueue.pb = false;
        else if (!serverQueue.pb) serverQueue.pb = true;
        return message.channel.send(serverQueue.pb ? 'I have enabled playback notifications.' : 'I have disabled playback notifications.');
    }
};