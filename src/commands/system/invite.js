const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class Invite extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            aliases: ['inv', 'botinvite']
        });
    }

    async exec(message, args) {
        return message.channel.send(new MessageEmbed().setURL(`https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=3435782`)
            .setColor(this.client.color).setTitle(`Thank you for taking consideration into inviting me!`));
    }
}