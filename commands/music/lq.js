const wait = require('util').promisify(setTimeout);
module.exports = {
    name: 'lq',
    description: 'Import the queue that you have previously saved.',
    cooldown: 15,
    args: true,
    usage: '<String>',
    aliases: ['qadd', 'qim', 'loadqueue', 'import'],
    async execute(message, args, client, user) {
        let queue = client.queue.get(message.guild.id);
        if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use this command.');
        else if (message.member.voice.selfDeaf) return message.channel.send('You need to be undeafened to use something like this.');
		if (!message.guild.me.hasPermission(['SPEAK', 'CONNECT', 'VIEW_CHANNEL'])) return message.channel.send('I do not have the required permissions to play music');
        if (!message.member.voice.channel.permissionsFor(message.guild.me).has(['SPEAK', 'CONNECT', 'VIEW_CHANNEL'])) return message.channel.send('I do not have the required permisssions to play music');
        if (!user.queues[args.join(' ')]) return message.channel.send('There was no saved queue under that name.');
        if (queue) {
            const filter = m2 => m2.content.toLowerCase() == 'yes' || m2.content.toLowerCase() == 'no' && m2.author.id == message.author.id && !m2.content.startsWith(client.prefix);
            if (queue.locked && queue.songs[0].requester.id !== message.author.id) return message.channel.send('This queue is currently locked to the requester of the current song.');
            if (message.guild.me.voice.channel !== message.member.voice.channel) return message.channel.send('You need to be in the same voice channel as me to use this command.');
            try {
                message.channel.send('Are you sure you want to add your saved queue to this current one?\n**Yes** or **No**');
                const r = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 15000,
                    errors: ['time']
                });
                if (r.first().content.toLowerCase() == 'yes') {
                    user.queues[args.join(' ')].forEach(async url => {
                        await wait(1500);
                        const { tracks } = await client.utils.music.getSongs(url, client);
                        tracks[0].requester = message.author;
                        queue.songs.push(tracks[0]);
                    });
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
            client.utils.music.createQueue(message.guild.id, message.member.voice.channel.id, client);
            queue = client.queue.get(message.guild.id);
            const queueSa = user.queues[args.join(' ')];
            const queueTe = queueSa.shift();

            await client.utils.music.join(message, client);

            client.utils.music.getSongs(queueTe).then(res => {
                res.tracks[0].requester = message.author;
                queue.songs.push(res.tracks[0]);
            });
            queueSa.forEach(async url => {
                await wait(1500);
                const res2 = await client.utils.music.getSongs(url);
                res2.tracks[0].requester = message.author;
                queue.songs.push(res2.tracks[0]);
            });

            await wait(1500);

            client.utils.music.play(message, queue.songs[0].track, client);
            return message.channel.send('Set and now playing!');
        }
    }
};
