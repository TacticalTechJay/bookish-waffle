module.exports = {
    name: 'skip',
    description: 'Skip music whenever needed. Though you can\'t skip when looping a song.',
    category: 'music',
    args: false,
    guildOnly: true,
    testing: false,
    aliases: ['s'],
    async execute(message, args, client) {
        const queue = client.queue.get(message.guild.id);
        if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use skip!');
        if (!queue) return message.channel.send('There is nothing currently playing.');
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You need to be in the same voice channel as me to use this command!');
        if (queue.looping === true) {
            return message.channel.send('I can not skip music that is looping.');
        }
        return client.manager.get(message.guild.id).stop();
    }
};
