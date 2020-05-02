const Command = require('../../structures/Command');
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
            .addField('Music', this.client.handler.commands.filter(c => c.category === 'music').map(c => `\`${c.name}\``).join(', '))
            .addField('Images', this.client.handler.commands.filter(c => c.category === 'image').map(c => `\`${c.name}\``).join(', '))
        if (message.channel.nsfw) embed.addField('NSFW', this.client.handler.commands.filter(c => c.category == 'nsfw').map(c => `\`${c.name}\``).join(', '))
        message.channel.send(embed);
    }
}