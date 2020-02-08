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
        if (!qsave) return message.channel.send('There is no queue that you have saved.');
        if (queue) {
            const filter = m2 => m2.content.toLowerCase() == 'yes' || m2.content.toLowerCase() == 'no' && m2.author.equals(message.author) && !m2.content.startsWith(client.prefix)
            try {
                message.channel.send('Are you sure you want to add your saved queue to this current one?\n**Yes** or **No**')                  
                const r = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 15000,
                    errors: ['time']
                })
                if (r.first().content.toLowerCase() == 'yes') {
                    qsave.map(s => queue.songs.push(s));
                    return message.channel.send('Added to queue!')
                } else if (r.first().content.toLowerCase() == 'no') return message.channel.send('Got it!')
            } catch (e) {
                if (!e) return message.channel.send('There was no response.');
                console.error(e);
            }
        } else if (!queue && !client.manager.get(message.guild.id)) {
            let qconstruct = {
                songs: qsave,
                looping: false
            }
            client.queue.set(message.guild.id, qconstruct);
            client.join(client, message);
            client.play(client, message, client.queue.get(message.guild.id).songs[0].track);
            return message.channel.send('Set and now playing!')
        }
    }
}