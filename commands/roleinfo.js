module.exports = {
	name: 'roleinfo',
	description: 'Get the role\'s info. If any permission overwrites show, they will be shown in the embed. Want permission overwrites for a certain voice channel? Connect to that voice channel.',
	usage: '<RoleName/RoleMention>',
	category: 'util',
	aliases: ['ri'],
	guildOnly: true,
	async execute(message, args) {
		const target = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(c => c.name.toLowerCase() == args.join(' ').toLowerCase()) || message.member.roles.highest;
		const roleP = message.channel.permissionOverwrites.get(target.id);
		const embed = new (require('discord.js').MessageEmbed)()
			.setTitle(`RoleInfo for ${target.name} (${target.id})`)
			.addField('Created Time & Date', require('moment').utc(target.createdAt).format('LLL'), true)
			.setColor(target.color)
			.addField('Position', target.position, true)
			.addField('Members', target.members.size, true)
			.addField('Is Hoisted', target.hoist ? 'Yes' : 'No', true)
			.addField('Is Managed', target.managed ? 'Yes' : 'No', true)
			.addField('Color', `#${target.color.toString(16)}`, true)
			.addField('Permissions (Role)', `\`\`\`${target.permissions ? target.permissions.toArray().join('\n') : 'NONE'}\`\`\``)
		if (roleP) embed.addField('Permissions (TextChannel)',`\`\`\`${roleP.allow ? roleP.allow.toArray().map(p => `+ ${p}`).join('\n') + '\n' : null}${roleP.deny ? roleP.deny.toArray().map(p => `- ${p}`).join('\n') : null}\`\`\``);
		if (message.member.voice.channel) {
			roleVCP = message.member.voice.channel.permissionOverwrites.get(target.id);
			if (roleVCP) embed.addField('Permissions (VoiceChannel)', `\`\`\`${ roleVCP.allow ? roleVCP.allow.toArray().map(p => `+ ${p}`) + '\n' : null }${roleVCP.deny ? roleVCP.deny.toArray().map(p => `- ${p}`).join('\n') : null}\`\`\``)
		}
		message.channel.send(embed).catch(e => console.error(`RoleInfo: ${e}`));
	}
};
