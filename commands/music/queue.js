module.exports = {
    name: 'queue',
    description: 'Check the queue of the list of songs that are being played.',
    testing: false,
    aliases: ['q', 'playingsoon'],
    cooldown: 5,
    execute(message, a, client) {
        const { Util } = require('discord.js');
        const serverQueue = client.queue.get(message.guild.id);
        let i = 1;
        if (!serverQueue) return message.channel.send('The queue is empty! I think it is about time to add songs, don\'t you think?');
        const queue = JSON.parse(JSON.stringify(serverQueue));
        queue.songs.shift();
        return message.channel.send(`**Now Playing:** ${serverQueue.songs[0].info.title}\n__**Song queue:**__\n${queue.songs.length < 1 ? 'Nothing left. What now?' : queue.songs.map(song => `${i++} **-** ${Util.escapeMarkdown(song.info.title)}`).join('\n')}`).catch(async e => {
            if (e.message == 'Invalid Form Body\ncontent: Must be 2000 or fewer in length.') {
                i = 1;
                const body = queue.songs.map(s => `${i++}: ${s.info.title}`).join('\n');
                queue.songs.length = 10;
                const fetch = require('node-fetch');
                const res = await fetch('https://bin.lunasrv.com/documents', {
                    method: 'POST',
                    body: body,
                    headers: { 'Content-Type': 'text/plain' }
                });
                i = 1;
                const { key } = await res.json();
                message.channel.send(`**Now Playing:** ${serverQueue.songs[0].info.title}\n__**Song queue:**__\n${queue.songs.map(song => `${i++} **-** ${Util.escapeMarkdown(song.info.title)}`).join('\n')}\n**Length:** ${serverQueue.songs.length} songs\nThe rest of the queue can be found here: https://bin.lunasrv.com/${key}`);
            }
            else {console.error(e);}
        });
    }
};
