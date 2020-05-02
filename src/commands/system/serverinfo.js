const Command = require('../../structures/Command');
const { MessageEmbed, Util } = require('discord.js');
const moment = require('moment');

module.exports = class ServerInfo extends Command {
    constructor(client) {
        super(client, {
            name: 'serverinfo',
            aliases: ['si', 'guildinfo', 'gi']
        });
    }

    async exec(message, args) {
        const embed = new MessageEmbed()
            .setColor(this.client.color)
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
            .addField('Server Information', `
**Name:** ${Util.escapeMarkdown(message.guild.name)}
**ID:** ${message.guild.id}
**Owner:** ${message.guild.owner.toString()}
**Verification:** ${message.guild.verificationLevel.toProperCase()}
**Partner Status:** ${message.guild.partnered ? 'Partnered' : 'Not partnered'}
**Nitro Boost:** Level **${message.guild.premiumTier}**, with **${message.guild.premiumSubscriptionCount}** Boosts
**Created At:** ${moment.utc(message.guild.createdAt).format('LLL')} (${moment.utc(message.guild.createdAt).fromNow()})
`).addField(`Users (${message.guild.members.cache.size})`, `
**Online:** ${message.guild.members.cache.filter(m => m.user.presence.status === 'online').size}
**Offline:** ${message.guild.members.cache.filter(m => m.user.presence.status === 'oflfine').size}
**Do not Disturb:** ${message.guild.members.cache.filter(m => m.user.presence.status === 'dnd').size}
**Idling:** ${message.guild.members.cache.filter(m => m.user.presence.status === 'idle').size}
`, true).addField(`Channels (${message.guild.channels.cache.size})`, `
**Text:** ${message.guild.channels.cache.filter(m => m.type === 'text').size}
**Voice:** ${message.guild.channels.cache.filter(m => m.type === 'voice').size}
**Categories:** ${message.guild.channels.cache.filter(m => m.type === 'category').size}
`, true).addField(`Roles (${message.guild.roles.cache.size})`, message.guild.roles.cache.map(x => x.toString()).join(' ').substring(0, 1024).replace(/\s\S+[^>]$/, ''));
        message.channel.send(embed);
    }
}