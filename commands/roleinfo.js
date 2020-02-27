module.exports = {
	name: 'roleinfo',
	description: 'Get the role\'s info',
	usage: '<RoleName/RoleMention>',
	category: 'util',
	aliases: ['ri'],
	async execute(message, args) {
		const target = message.mentions.roles.first() || message.guild.roles.cache.find(c => c.name == args.join(' ')) || message.member.roles.highest;
		const embed = new (require('discord.js').MessageEmbed)()
			.setTitle(`RoleInfo for ${target.name} (${target.id})`)
			.addField('Created Time & Date', require('moment').utc(target.createdAt).format('LLL'), true)
			.setColor(target.color)
			.addField('Position', target.position, true)
			.addField('Members', target.members.size, true)
			.addField('Is Hoisted', target.hoist ? 'Yes' : 'No', true)
			.addField('Is Managed', target.managed ? 'Yes' : 'No', true)
			.addField('Color', `#${target.color.toString(16)}`, true)
			.addField('Permissions', `\`\`\`${target.permissions.toArray().join('\n')}\`\`\``);
		message.channel.send(embed).catch(e => console.error(`RoleInfo: ${e}`));
	}
};
