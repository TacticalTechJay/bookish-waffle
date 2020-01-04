module.exports = {
    name: 'queue',
    description: 'Check the queue of the list of songs that are being played.',
    category: 'music',
    guildOnly: true,
    testing: false,
    aliases: ['q', 'playingsoon'],
    execute(message, a, client) {
        const serverQueue = client.queue.get(message.guild.id);
        let i = 1;
        if (!serverQueue) return message.channel.send('The queue is empty! I think it is about time to add songs, don\'t you think?');
        var queue = JSON.parse(JSON.stringify(serverQueue));
        queue.songs.shift();
        return message.channel.send(`__**Song queue:**__\n${queue.songs.map(song => `${i++} **-** ${song.info.title}`).join('\n')}\n**Now playing:** ${serverQueue.songs[0].info.title}`);
    }
};
