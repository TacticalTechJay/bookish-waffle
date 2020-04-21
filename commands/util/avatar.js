module.exports = {
    name: 'avatar',
    description: 'Obtain the a user\'s profile picture.',
    cooldown: 5,
    aliases: ['pfp', 'profilepicture'],
    args: false,
    testing: false,
    usage: '[MemberMention/UserID]',
    async execute(message, args, client) {
        const { MessageEmbed } = require('discord.js');
        if (!args[0]) {
            const embed = new MessageEmbed()
            .setTitle(`${message.author.username}'s Avatar`)
            .setImage(message.author.displayAvatarURL({ size: 2048, dynamic: true }))
            .setURL(message.author.displayAvatarURL({ size: 2048, dynamic: true }))
            .setColor(0x36bdfc);
            return message.channel.send(embed);
        }
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.tag.includes(args.join(' '))) || await client.users.fetch(args[0]);
        if (!user) return message.channel.send('No user found.');
        const pfp = user.displayAvatarURL ? user.displayAvatarURL({ size: 2048, dynamic: true }) : user.user.displayAvatarURL({ size: 2048, dynamic: true });
        const embed = new MessageEmbed()
            .setTitle(`${user.username ? user.username : user.user.username}'s Avatar`)
            .setColor(0x36bdfc)
            .setURL(pfp)
            .setImage(pfp);
        message.channel.send(embed);
    }
};
