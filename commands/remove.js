module.exports = {
    name: 'remove',
    description: 'Remove a song from the queue with this command.',
    category: 'music',
    guildOnly: true,
    testing: false,
    args: true,
    cooldown: 5,
    aliases: ['rm', 'deletethis'],
    usage: '<num/last>',
    execute(message, args, client) {
        const serverQueue = client.queue.get(message.guild.id);
        if (args[0].toLowerCase() == 'last') {
            if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use this command!');
            if (!message.guild.me.voice.channel) return message.channel.send('I am not in a voice channel. :thinking:');
            if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You need to be in the same voice channel as me to use this command!');
            if (serverQueue.songs.length == 1) return message.channel.send('**No.**');
            serverQueue.songs.pop();
            return message.channel.send('Removed the last song of the queue.');
        }
        const toRemove = parseInt(args[0]);
        if (!serverQueue) return message.channel.send('It appears as though there is nothing to remove.');
        if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use this command!');
        if (!message.guild.me.voice.channel) return message.channel.send('I am not in a voice channel. :thinking:');
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You need to be in the same voice channel as me to use this command!');
        if (isNaN(toRemove)) return message.channel.send('That is not a number. :neutral_face:');
        if (toRemove == 0) return message.channel.send('Why do you want to remove this song? Try using skip instead!');
        serverQueue.songs.splice(toRemove, 1);
        return message.channel.send('The deed is done.');
    }
}