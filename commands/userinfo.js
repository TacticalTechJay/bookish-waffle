const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'userinfo',
    description: 'Displays information about a user.',
    category: 'util',
    guildOnly: true,
    args: false,
    testing: false,
    aliases: ['ui'],
    usage: '[MemberMention/UserID]',
    async execute(message, args, client) {
        if (!args[0]) {
            const user = message.member;
            const embed = new MessageEmbed()
                .setColor(0x12db37)
                .setTitle(`${user.user.username}#${user.user.discriminator} (${user.id})`)
                .addField('Bot', user.user.bot ? 'Yes' : 'No', true)
                .addField('Nickname', user.nickname ? user.nickname : 'No nickname', true)
                .addField('Presence', user.presence.status.titleCase(), true)
                .addField('Created Date', require('moment')(user.user.createdAt).format('MMMM Do[,] YYYY'), true)
                .addField('Joined Date', require('moment')(user.joinedAt).format('MMMM Do[,] YYYY'), true)
	            .addField(`Roles (${--message.member.roles.cache.size})`, message.member.roles.cache ? message.member.roles.cache.map(x => x.toString()).join(' ').substring(0, 1024).replace(/\s\S+[^>]$/, '') : 'None')
                .setColor(0x679f28)
                .setThumbnail(user.user.displayAvatarURL());
            return message.channel.send(embed);
        }
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.username.includes(args.join(' '))) || await client.users.fetch(args[0]);
        const embed = new MessageEmbed()
            .setColor(0x12db37)
            .setTitle(`${user.user ? user.user.tag : user.tag} (${user.id})`)
            .addField('Bot', user.user ? user.user.bot ? 'Yes' : 'No' : user.bot ? 'Yes' : 'No', true)
            .addField('Nickname', user.nickname ? user.nickname : 'N/A', true)
            .addField('Presence', user.presence.status.titleCase(), true)
            .addField('Created Date', require('moment')(user.user ? user.user.createdAt : user.createdAt).format('MMMM Do[,] YYYY'), true)
            .addField('Joined Date', `${user.joinedAt ? require('moment')(user.joinedAt).format('MMMM Do[,] YYYY') : 'N/A'}`, true)
            .setColor(0x679f28)
            .setThumbnail(user.user ? user.user.displayAvatarURL() : user.displayAvatarURL());
		if (user.roles) embed.addField(`Roles (${--user.roles.cache.size})`, user.roles.cache ? user.roles.cache.map(x => x.toString()).join(' ').substring(0, 1024).replace(/\s\S+[^>]$/, '') : 'None');
        return message.channel.send(embed);
    }
};
