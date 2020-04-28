module.exports = {
    name: 'mylist',
    description: 'List your saved queues in case you have forgotten any of them!',
    args: false,
    cooldown: 15,
    async execute(message, args, client, user) {
        const fetch = require('node-fetch');
        if (!user) return message.channel.send('You do not have any saved queues to list.');
        const body = Object.keys(user.queues);
        const res = await fetch('https://bin.lunasrv.com/documents', {
            method: 'POST',
            body: body,
            headers: { 'Content-Type': 'text/plain' }
        });
        const { key } = await res.json();
        message.channel.send(`Your saved queues are listed here: https://bin.lunasrv.com/${key}`);
    }
};