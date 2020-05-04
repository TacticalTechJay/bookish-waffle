const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class GetID extends Command {
    constructor(client) {
        super(client, {
            name: 'id',
            aliases: ['userid'],
            description: `Get your ID!`
        });
    }

    async exec(message, args) {
        return message.channel.send(`Your ID: **${message.author.id}**`);
    }
}