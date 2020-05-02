module.exports = {
    name: 'shuffle',
    description: 'Shuffle the queue once or twice.',
    aliases: ['mix', 'remix', 'mixup'],
    cooldown: 5,
    async execute(message, args, client) {
        const serverQueue = client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing, so I won\'t be able to shuffle!');
		if (serverQueue.locked && serverQueue.songs[0].requester.id !== message.author.id) return message.channel.send('This queue is currently locked to the requester of the current song.');
		if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use this command!');
		if (!message.guild.me.voice.channel) return message.channel.send('I am not in a voice channel. :thinking:');
		else if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You need to be in the same voice channel as me ot use this command!');
		else if (message.member.voice.selfDeaf) return message.channel.send('You need to be undeafened to use something like this.');
        serverQueue.songs.shuffle();
        return message.channel.send('All songs have been shuffled! Yay! :D');
    }
}