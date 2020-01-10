module.exports = {
	name: 'slap',
	description: 'Slap someone (or me) or I can slap you!',
	category: 'anime',
	testing: false,
	guildOnly: true,
	args: false,
	cooldown: 3,
	usage: '<mention>',
	async execute(message, args, client) {
		const { MessageEmbed } = require('discord.js');
		const { url } = await client.nekosSafe.slap();
		const target = message.mentions.members.first() || message.guild.members.get(args[0]);
		message.channel.send(`${target ? `${target} was slapped by ${message.author}!`: `${message.author} you wanted it, so you'll get it.`}`).catch(e => throw e.stack);
	}
}
