const { Command } = require('../structures/Command');

module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: ['h', '?']
        });
    }

    async exec(message, args) {
        message.channel.send('hi');
    }
}