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
	    .addField('Verification Level', ['`None`', '`Low`', '`Medium`', '`(╯°□°）╯︵ ┻━┻`', '`┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻`'][message.guild.verificationLevel], true)
            .addField('Partner Status', message.guild.partnered ? 'Partnered' : 'Not partnered', true)
            .addField('Boost Count', message.guild.premiumSubscriptionCount, true)
            .addField('Boost Level', message.guild.premiumTier, true)
            .addField('Server Creation Date', require('moment')(message.guild.createdAt).format('MMMM Do[,] YYYY'), true)
            .addField('Server Users', `${message.guild.members.cache.size} total users\n${message.guild.members.cache.filter(m => !m.user.bot).size} members\n${message.guild.members.cache.filter(m => m.user.bot).size} bots`, true)
            .addField('Channels', `${message.guild.channels.cache.filter(c => c.type == 'category').size} categories\n${message.guild.channels.cache.filter(c => c.type == 'voice').size} voice channels\n${message.guild.channels.cache.filter(c => c.type == 'text').size} text channels`, true)
	    .addField(`Roles (${message.guild.roles.cache.size})`, message.guild.roles.cache.map(x => x.toString()).join(' ').substring(0, 1024).replace(/\s\S+[^>]$/, ''));
        message.channel.send(embed);
    }
}
