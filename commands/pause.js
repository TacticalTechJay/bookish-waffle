module.exports = {
    name: 'pause',
    description: 'Pause the music and 🙉',
    category: 'music',
    args: false,
    guildOnly: true,
    testing: false,
    cooldown: 5,
    execute(message, a, client) {
        const serverQueue = client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing that I *can* pause.');
        if (client.manager.players.get(message.guild.id).paused) return message.channel.send('The music is still paused.');
        if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use this command.');
        else if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You need to be in the same voice channel as me to use this command.');
        else if (message.member.voice.selfDeaf) return message.channel.send('You need to be undeafened to use something like this.');
        client.manager.players.get(message.guild.id).pause(true);
        return message.channel.send('I have paused the music that was playing.');
    }
};
