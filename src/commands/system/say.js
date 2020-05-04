const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class Say extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            aliases: ['echo'],
            description: `Make me say anything you want!`,
            usage: '[Message]'
        });
    }

    async exec(message, args) {
        if (!args[0]) return message.channel.send(`You might want to include what you want me to say... -_-`)
        return message.channel.send(args.join(' '));
    }
}