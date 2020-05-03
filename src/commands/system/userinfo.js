const Command = require('../../structures/Command');
const { MessageEmbed, Util } = require('discord.js');
const moment = require('moment');

module.exports = class UserInfo extends Command {
    constructor(client) {
        super(client, {
            name: 'userinfo',
            aliases: ['ui', 'info']
        });
    }

    async exec(message, args) {
        let member = null;
        if (!args[0]) member = message.member;
        else {
            const members = this.client.util.users.findMember(args[0], message.guild.members.cache, { multiple: true });
            if (members.size === 1) member = members.first();
            else {
                let i = 1;
                message.channel.send(new MessageEmbed()
                    .setColor(this.client.color)
                    .setTitle('Multiple users found!')
                    .setDescription(`Looks like there were **${members.size}** users found when searching for ${Util.escapeMarkdown(args[0])}, pick a number in **1 minute** to get info on them.\n\n${members.map(m => `**${i++}.** ${m.user.tag} (**${m.id}**)`).join('\n')}`))
                const c = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] });
                if (members.array()[Number(c.first().content) - 1]) member = members.array()[Number(c.first().content) - 1];
                else return message.channel.send(`Bummer, looks like that user doesn't exist.`)
            }
        }
        if (!member) return message.channel.send(`Bummer, looks like that user doesn't exist.`)
        const presenceStatus = { online: 'Online', offline: 'Offline', dnd: 'Do not Disturb', idle: 'Idling' }
        const embed = new MessageEmbed()
            .setColor(member.roles.highest.color ? member.roles.highest.color : this.client.color)
            .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .addField('User Information', `
**Username:** **${Util.escapeMarkdown(member.user.username)}**#${member.user.discriminator}
**Discriminator:** ${member.user.discriminator}
**Badges:** ${member.user.flags.toArray().length > 0 ? this.client.util.userFlagsToEmoji(member.user.flags.toArray()).join(' ') : 'No badges'}
**Nickname:** ${member.nickname ? Util.escapeMarkdown(member.nickname) : 'None'}
**Bot?:** ${member.user.bot ? 'Yes' : 'No'}
**Status:** ${presenceStatus[member.user.presence.status]}
`)
            .addField('Member Information', `
**Joined ${Util.escapeMarkdown(message.guild.name)}:** ${moment.utc(member.joinedAt).format('LLL')} (${moment.utc(member.joinedAt).fromNow()})
**Created Account:** ${moment.utc(member.user.createdAt).format('LLL')} (${moment.utc(member.user.createdAt).fromNow()})
`)
            .addField(`Roles (${member.roles.cache.filter(c => c.name !== '@everyone').size})`, member.roles.cache ? member.roles.cache.map(x => x.toString()).join(' ').substring(0, 1024).replace(/\s\S+[^>]$/, '') : 'None');



        message.channel.send(embed);
    }
}