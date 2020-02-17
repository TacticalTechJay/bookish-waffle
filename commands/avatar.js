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
        const { MessageEmbed } = require('discord.js')
        if (!args[0]) {
            const embed = new MessageEmbed()
            .setTitle(`[${message.author.username}'s Avatar](${message.author.displayAvatarURL({ size: 2048, dynamic: true })})`)
            .setImage(message.author.displayAvatarURL({ size: 2048, dynamic: true }))
            .setColor(0x36bdfc);
            return message.channel.send(embed);
        }
        const user = await message.mentions.users.first() || await client.users.get(args[0]) ||await client.fetchUser(args[0]);
        const embed = new MessageEmbed()
            .setTitle(`[${user.username}'s Avatar](${user.displayAvatarURL({ size: 2048, dynamic: true })})`)
            .setColor(0x36bdfc)
            .setImage(user.displayAvatarURL({size: 2048, dynamic: true}));
        message.channel.send(embed);
    }
}
