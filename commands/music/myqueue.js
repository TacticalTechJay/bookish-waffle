module.exports = {
    name: 'myqueue',
    description: 'Get the list of songs within the queue. ~~Only has URLs~~',
    args: true,
    cooldown: 15,
    usage: '<String:QueueName>',
    async execute(message, args, client, user) {
        const queue = user.queues[args.join(' ')];
        if (!queue) return message.channel.send('There is no queue under that name!');
        var body = queue.join('\n');
        if (body.length >= 31 + args.join(' ').length) {
            var { key } = client.utils.bin(body);
        }
        message.channel.send(`Your songs for \`${args.join(' ')}\` are here:\n\`\`\`${body.length >= 31 + args.join(' ').length ? `https://bin.lunasrv.com/${key}` : body}\`\`\``);
    }
};