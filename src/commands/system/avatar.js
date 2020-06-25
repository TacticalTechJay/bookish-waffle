const Command = require('../../structures/Command');
const { MessageEmbed, Util } = require('discord.js');

module.exports = class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            aliases: ['a', 'useravatar', 'pfp'],
            description: 'Get a users avatar',
            usage: '[User?]'
        });
    }

    async exec(message, args) {
        var member;
        if (!args[0]) member = message.member;
        else {
            const members = this.client.util.users.findMember(args[0], message.guild.members.cache, { multiple: true });
            if (members.size === 1) member = members.first();
            else if (members.size === 0) {
                try {
                    member = await this.client.users.fetch(args[0]);
                }
                catch (e) {
                    return message.channel.send('No members found');
                }
            }
            else {
                let i = 1;
                message.channel.send(new MessageEmbed()
                    .setColor(this.client.color)
                    .setTitle('Multiple users found!')
                    .setDescription(`Looks like there were **${members.size}** users found when searching for ${Util.escapeMarkdown(args[0])}, pick a number in **1 minute** to get info on them.\n\n${members.map(m => `**${i++}.** ${m.user.tag} (**${m.id}**)`).join('\n')}`));
                const c = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] });
                if (members.array()[Number(c.first().content) - 1]) member = members.array()[Number(c.first().content) - 1];
                else return message.channel.send('Bummer, looks like that user doesn\'t exist.');
            }
        }
        if (!member) return message.channel.send('Bummer, looks like that user doesn\'t exist.');
        const embed = new MessageEmbed()
            .setColor(member.roles?.highest.color ? member.roles.highest.color : this.client.color)
            .setTitle(`${member.displayName || member.username}'s Avatar`)
            .setURL(member.user ? member.user.displayAvatarURL({ dynamic: true }) : member.displayAvatarURL({ dynamic: true }))
            .setImage(member.user ? member.user.displayAvatarURL({ dynamic: true, size: 2048 }) : member.displayAvatarURL({ dynamic: true, size: 2048 }));
        message.channel.send(embed);
    }
};