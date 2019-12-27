const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'serverinfo',
    description: 'Obtain server information.',
    category: 'util',
    aliases: ['si'],
    guildOnly: true,
    args: false,
    async execute(message, args, client) {
        let embed = new MessageEmbed()
            .setTitle(`${message.guild.name}'s Information`)
            .setThumbnail(message.guild.iconURL())
            .addField('Server Owner', message.guild.owner, true)
            .addField('Server ID', message.guild.id, true)
            .addField('Partner Status', message.guild.partnered ? 'Partnered' : 'Not partnered', true)
            .addField('Boost Count', message.guild.premiumSubscriptionCount, true)
            .addField('Boost Level', message.guild.premiumTier, true)
            .addField('Server Creation Date', message.guild.createdAt.toString().slice(0, 25), true)
            .addField('Server Users', `${message.guild.members.size} total users\n${message.guild.members.filter(m => !m.user.bot).size} members\n${message.guild.members.filter(m => m.user.bot).size} bots`, true)
            .addField('Channels', `${message.guild.channels.filter(c => c.type == 'category').size} categories\n${message.guild.channels.filter(c => c.type == 'voice').size} voice channels\n${message.guild.channels.filter(c => c.type == 'text').size} text channels`, true)
        if (message.guild.roles.map(r => r).join(' | ').length > 1024) {
            embed.addField(`Roles (${message.guild.roles.size})`, message.guild.roles.map(r => r).slice(0, 20).join(' | '));
            return message.channel.send(embed);
        } 
        embed.addField(`Roles (${message.guild.roles.size})`, message.guild.roles.map(r => r).join(' | '));
        message.channel.send(embed);
    }
}