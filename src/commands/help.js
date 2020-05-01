const { Command } = require('../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: ['h', '?']
        });
    }

    async exec(message, args) {
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
            .addField('System', this.client.handler.commands.filter(c => c.category === 'system').map(c => `\`${c.name}\``).join(', '))
        message.channel.send(embed);
    }
}