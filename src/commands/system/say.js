const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class Say extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            aliases: ['echo']
        });
    }

    async exec(message, args) {
        return message.channel.send(args.join(' '));
    }
}