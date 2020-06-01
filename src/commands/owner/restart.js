const Command = require('../../structures/Command');

module.exports = class Restart extends Command {
    constructor(client) {
        super(client, {
            name: 'restart',
            devOnly: true
        });
    }

    async exec(message) {
        message.channel.send('👋 Deed is done.').then(() => process.exit(1));
    }
};