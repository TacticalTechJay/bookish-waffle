const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping'
        });
    }

    async exec(message, args) {
        message.channel.send('Ping?').then(m => m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(this.client.ws.ping)}ms`));
    }
}