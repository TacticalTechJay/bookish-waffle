module.exports = {
    name: 'mylist',
    description: 'List your saved queue in case you have forgotten it!.',
    category: 'music',
    args: false,
    guildOnly: true,
    cooldown: 15,
    async execute(message, args, client) {
        const fetch = require('node-fetch');
        const qsave = client.qsaves.get(`g${message.guild.id}me${message.author.id}`);
        let i = 1;
        if (!qsave) return message.channel.send('You have no existing queue save to list.');
        const body = qsave.map(s => `${i++}: ${s.info.title}`).join('\n');
        const res = await fetch('https://bin.lunasrv.com/documents', {
            method: 'POST',
            body: body,
            headers: { 'Content-Type': 'text/plain' }
        });
        const { key } = await res.json();
        message.channel.send(`Your saved queue is listed here:\n https://bin.lunasrv.com/${key}`);
    }
}