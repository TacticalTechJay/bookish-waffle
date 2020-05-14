const Command = require('../../../structures/Command');
const { Util } = require('discord.js');

module.exports = class ListQueue extends Command {
    constructor(client) {
        super(client, {
            name: 'removequeue',
            aliases: ['rmqueue', 'rmq', 'rmls', 'rmqs', 'rq'],
            category: 'music',
            description: 'Remove a queue that you have saved, you will not be able to retrieve them again',
            usage: '[Name]'
        });
    }

    async exec(message, args) {
        if (!args[0]) return message.channel.send('You are missing an argument!');
        const user = await this.client.util.user(message.author.id);
        if (Object.keys(user.queues).length === 0) return message.channel.send('You don\'t have any queues, there is only void.');
        const queue = user.queues[args.join(' ')];
        if (!queue) return message.channel.send('Looks like that queue isnt saved, so we can\'t delete it.');
        user.queues = Object.fromEntries(Object.entries(user.queues).filter(c => c[0] !== args.join(' ')));
        this.client.orm.repos.user.save(user);
        return message.channel.send(`Alright, we removed the queue **${Util.escapeMarkdown(args.join(' '))}** from your saved queues!`);
    }
};