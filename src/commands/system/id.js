const Command = require('../../structures/Command');

module.exports = class GetID extends Command {
    constructor(client) {
        super(client, {
            name: 'id',
            aliases: ['userid'],
            description: 'Get your ID!'
        });
    }

    async exec(message) {
        const user = message.mentions.users.first() || message.author;
        return message.channel.send(`${user}'s ID: **${user.id}**`);
    }
};