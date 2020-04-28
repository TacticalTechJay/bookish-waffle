module.exports = {
    name: 'qdel',
    description: 'Delete your saved queue if you don\'t want one anymore.',
    args: false,
    cooldown: 5,
    async execute(message, args, client) {
        const user = await client.orm.repos.user.findOne({ id: message.author.id });
        if (!user.queues[args.join(' ')]) return message.channel.send('There was no queue saved under that name.');
        delete user.queues[args.join(' ')];
        await client.orm.repos.user.save(user);
        return message.channel.send('Your saved queue has been deleted.');
    }
};