module.exports = {
    name: 'resume',
    description: 'Resumes the currently playing song.',
    category: 'music',
    args: false,
    guildOnly: true,
    testing: false,
    cooldown: 5,
    execute(message, a, client) {
        const serverQueue = client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing that I *can* pause.');
        if (!message.member.voice.channel.id) return message.channel.send('You need to be in a voice channel to use this command.');
        else if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You need to be in the same voicechannel as me to use this command.');
        else if (message.member.voice.selfDeaf) return message.channel.send('You need to be undeafened to use something like this.');
        if (!client.manager.get(message.guild.id).paused) return message.channel.send('The music is still playing.');
        client.manager.get(message.guild.id).resume();
        return message.channel.send('I have resumed the music that was playing.');
    }
};
