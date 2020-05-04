const Command = require('../../../structures/Command');
const { MessageEmbed, Util } = require('discord.js');

module.exports = class ListQueue extends Command {
    constructor(client) {
        super(client, {
            name: 'listqueues',
            aliases: ['ls', 'lsq', 'queuelist', 'ql'],
            category: 'music',
            description: 'List all of your queues, or every song in a queue!',
            usage: '[Name?]'
        });
    }

    async exec(message, args) {
        const user = await this.client.util.user(message.author.id);
        if (!args[0]) return message.channel.send(`${Object.keys(user.queues).length === 0 ? `You have not saved any queues yet!` : `Saved queues: ${Object.keys(user.queues).map(c => Util.escapeMarkdown(c)).join(', ')}`}`)
        const queue = user.queues[args.join(' ')];
        if (!queue) return message.channel.send(`Looks like that queue isnt saved...`);
        let i = 1;
        const a = await this.client.util.uploadToHastebin(queue.map(c => `${i++}. ${c.info.title}`).join('\n'));
        return message.channel.send(`Heres the songs for queue **${Util.escapeMarkdown(args.join(' '))}**\n${a.url}`)
    }
}