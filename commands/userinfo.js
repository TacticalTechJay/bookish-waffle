const { MessageEmbed } = require('discord.js')
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
            let user = message.member;
            const embed = new MessageEmbed()
                .setColor(0x12db37)
                .setTitle(`${user.user.username}#${user.user.discriminator} (${user.id})`)
                .addField('Bot', user.user.bot ? 'Yes': 'No', true)
                .addField('Nickname', user.nickname ? user.nickname : 'No nickname', true)
                .addField('Presence', user.presence.status, true)
                .addField('Created Date', require('moment')(user.user.createdAt).calendar(), true)
                .addField('Joined Date', require('moment')(user.joinedAt).calendar(), true)
                .setColor(0x679f28)
                .setThumbnail(user.user.displayAvatarURL());
            return message.channel.send(embed);
        }
        let user = await message.mentions.members.first() || await message.guild.members.get(args[0]);
        if (!user) { 
            user = await client.users.fetch(args[0]);
            const embed = new MessageEmbed()
                .setColor(0x0cecf7)
                .setTitle(`${user.username}#${user.discriminator} (${user.id})`)
                .addField('Bot', user.bot ? 'Yes': 'No', true)
                .addField('Created Date', require('moment')(user.createdAt).calendar(), true)
                .setColor(0x5ea6db)
                .setThumbnail(user.displayAvatarURL());
            message.channel.send('Not much can be found except this. This user was not in guild:')
            return message.channel.send(embed);
         }
        else {
            const embed = new MessageEmbed()
                .setColor(0x12db37)
                .setTitle(`${user.user.username}#${user.user.discriminator} (${user.id})`)
                .addField('Bot', user.user.bot ? 'Yes' : 'No', true)
                .addField('Nickname', user.nickname ? user.nickname : 'No nickname', true)
                .addField('Presence', user.presence.status, true)
                .addField('Created Date', require('moment')(user.user.createdAt).calendar(), true)
                .addField('Joined Date', `${user.joinedAt ? require('moment')(user.joinedAt).calendar() : 'N/A'}`, true)
                .setColor(0x679f28)
                .setThumbnail(user.user.displayAvatarURL());
            return message.channel.send(embed);
        }
    }
}
