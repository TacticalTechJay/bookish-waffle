const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	category: 'general',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args, client) {
		const { MessageEmbed } = require('discord.js');
		const data = [];
		const { commands } = client;

		if (!args.length) {
			const embed = new MessageEmbed()
				.setTitle('Bot Commands')
				.addField(`General (${commands.filter(command => command.category === 'general').size})`, commands.filter(command => command.category === 'general').map(command => `\`${command.name}\``).join(', '), false)
				.addField(`Moderation (${commands.filter(command => command.category === 'moderation').size})`, commands.filter(command => command.category === 'moderation').map(command => `\`${command.name}\``).join(', '), false)
				.addField(`Music (${commands.filter(command => command.category === 'music').size})`, commands.filter(command => command.category === 'music').map(command => `\`${command.name}\``).join(', '), false)
				.addField(`Utilities (${commands.filter(command => command.category === 'util').size})`, commands.filter(command => command.category === 'util').map(command => `\`${command.name}\``).join(', '), false)
				.addField(`Anime (${commands.filter(command => command.category === 'anime').size})`, commands.filter(command => command.category === 'anime').map(command => `\`${command.name}\``).join(', '), false)
				.addField(`NSFW (${commands.filter(command => command.category === 'nsfw').size})`, commands.filter(command => command.category === 'nsfw').map(command => `\`${command.name}\``).join(', '), false)
				.setColor(0x00fff9)
				.setFooter(`You can send "${prefix}help [command name]" to get info on a specific command!`);

			return message.channel.send(embed);
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		message.channel.send(data, { split: true });
	},
};
