module.exports = {
    name: 'import',
    description: 'Import the queue that you have previously saved.',
    args: false,
    guildOnly: true,
    aliases: ['qadd', 'qim'],
    category: 'music',
    async execute(message, args, client) {
        const queue = client.queue.get(message.guild.id);
        const qsave = client.qsaves.get(`g${message.guild.id}me${message.author.id}`);
        if (!qsave) return message.channel.send('You currently have no saved queue.');
        if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use this command.');
        else if (message.member.voice.selfDeaf) return message.channel.send('You need to be undeafened to use something like this.');
        if (queue) {
            const filter = m2 => m2.content.toLowerCase() == 'yes' || m2.content.toLowerCase() == 'no' && m2.author.id == message.author.id && !m2.content.startsWith(client.prefix);
            if (message.guild.me.voice.channel !== message.member.voice.channel) return message.channel.send('You need to be in the same voice channel as me to use this command.');
            try {
                message.channel.send('Are you sure you want to add your saved queue to this current one?\n**Yes** or **No**');
                const r = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 15000,
                    errors: ['time']
                });
                if (r.first().content.toLowerCase() == 'yes') {
                    qsave.map(s => queue.songs.push(s));
                    return message.channel.send('Added to queue!');
                }
                else if (r.first().content.toLowerCase() == 'no') {return message.channel.send('Cancelled.');}
            }
        catch (e) {
                if (e.size == 0) return message.channel.send('There was no response.');
                return console.error(e);
            }
        }
        else if (!queue && !client.manager.players.get(message.guild.id)) {
            const qconstruct = {
                songs: qsave,
                looping: 'disabled',
                pb: true,
                channel: message.member.voice.channel.id
            };
            client.queue.set(message.guild.id, qconstruct);
            client.join(message);
            client.play(message, client.queue.get(message.guild.id).songs[0].track);
            return message.channel.send('Set and now playing!');
        }
    }
};
