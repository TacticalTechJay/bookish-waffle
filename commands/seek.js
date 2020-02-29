module.exports = {
    name: 'seek',
    description: 'Fastforward or rewind a song.',
    category: 'music',
    args: true,
    guildOnly: true,
    usage: '<Timestamp>',
    async execute(message, args, client) {
        const player = client.manager.get(message.guild.id);
        const queue = client.queue.get(message.guild.id);
        let time = args[0].split(':');
        if (!player || !queue) return message.channel.send('You need to be playing music to use this command');
        if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel.')
        else if (message.member.voice.channel !== message.guild.me.voice.channel) return message.channel.send('You need to be in the same voice channel as me!')
        else if (message.member.voice.selfDeaf) return message.channel.send('You need to be undeafened to use something like this.');
        var s = 0, m = 1

        while (time.length > 0) {
            s += m * parseInt(time.pop(), 10)
            m = 60;
        }
        if (s*1000 > queue.songs[0].info.length) return message.channel.send('That is wayyyyy out of my league.');
        if (isNaN(s)) return message.channel.send('I can\'t seek with that!');
        player.seek(s*1000);
        return message.channel.send(`Seeked to **${args[0]}**.`);
    }
};
