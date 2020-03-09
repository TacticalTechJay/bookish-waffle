module.exports = {
    name: 'stop',
    description: 'Stop music in case of emergencies! Or you simply got bored of songs.',
    category: 'music',
    args: false,
    guildOnly: true,
    testing: false,
    async execute(message, args, client) {
        const queue = client.queue.get(message.guild.id);
        if (!queue) return message.channel.send('There seems to be nothing playing. :thinking:');
        if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use this command!');
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You need to be in the same voice channel as me to use this command!');
        if (message.member.voice.selfDeaf) return message.channel.send('You need to be undeafened to use something like this.');
        try {
            await client.manager.leave(message.guild.id);
        }
        catch(e) {
            console.log(e);
            return message.channel.send('Something went wrong while leaving.');
        }
        return message.channel.send('Music has been stopped.');
    }
};
