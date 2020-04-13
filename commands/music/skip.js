module.exports = {
    name: 'skip',
    description: 'Skip music whenever needed. Though you can\'t skip when looping a song.',
    args: false,
    guildOnly: true,
    testing: false,
    aliases: ['s'],
    async execute(message, args, client) {
        const queue = client.queue.get(message.guild.id);
        const op1 = ['single', 'song', 'now'];
        if (!queue) return message.channel.send('There is nothing currently playing.');
        if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use skip!');
        else if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You need to be in the same voice channel as me to use this command!');
		else if (message.member.voice.selfDeaf) return message.channel.send('You need to be undeafened to use something like this.');
        if (op1.includes(queue.looping)) return message.channel.send('I can not skip a song that is currently looping like this.');
        client.manager.players.get(message.guild.id).stop();
        return message.channel.send('Skipped!');
    }
};
