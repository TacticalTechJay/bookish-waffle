module.exports = {
    name: 'avatar',
    description: 'Obtain the a user\'s profile picture.',
    category: 'util',
    guildOnly: false,
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
        const user = await message.mentions.users.first() || await client.users.cache.get(args[0]) || await client.users.fetch(args[0]);
        const embed = new MessageEmbed()
            .setTitle(`${user.username}'s Avatar`)
            .setColor(0x36bdfc)
            .setURL(user.displayAvatarURL({ size: 2048, dynamic: true }))
            .setImage(user.displayAvatarURL({ size: 2048, dynamic: true }));
        message.channel.send(embed);
    }
};
