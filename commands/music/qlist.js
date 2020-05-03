module.exports = {
    name: 'qlist',
    description: 'List your saved queues in case you have forgotten any of them!',
    args: false,
    cooldown: 15,
    async execute(message, args, client, user) {
        const queues = Object.keys(user.queues);
        const body = queues.join('\n');
        if (queues < 1) return message.channel.send('You do not have any saved queues to list.');
        if (body.length >= 1967) {
            var { key } = client.utils.bin(body);
         }
        message.channel.send(`Your saved queues are listed here:${body.length >= 1967 ? ` https://bin.lunasrv.com/${key}` : `\n\`\`\`${body}\`\`\``}`);
    }
};