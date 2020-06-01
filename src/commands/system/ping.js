const Command = require('../../structures/Command');

module.exports = class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: 'Check my response times.'
        });
    }

    async exec(message) {
        message.channel.send('Ping?').then(m => m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(this.client.ws.ping)}ms`));
    }
};