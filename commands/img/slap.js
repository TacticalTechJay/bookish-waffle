module.exports = {
	name: 'slap',
	description: 'Slap someone (or me) or I can slap you!',
	testing: false,
	guildOnly: true,
	args: false,
	cooldown: 3,
	usage: '<mention>',
	async execute(message, args, client) {
		const { url } = await client.nekosSafe.slap();
		const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		message.channel.send({ content: `${target ? `${target} was slapped by ${message.author}!` : `${message.author} you wanted it, so you'll get it.`}`, embed: { image: { url: url } } });
	}
};
