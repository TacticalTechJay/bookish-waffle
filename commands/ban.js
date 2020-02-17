module.exports = {
	name: 'ban',
	description: 'Ban the super expired doritos.',
	category: 'moderation',
	guildOnly: true,
	args: true,
	usage: '<Mention/UserID>',
	cooldown: 5,
	async execute(message, args, client) {
		const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.users.fetch(args[0]);
		let reason = args.slice(1).join(' ');
		if (member.user == message.author) {
			return message.channel.send('Why would you want to ban yourself? :frowning:');
		}
		if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
			return message.channel.send('Umm, mind if you hand me a ban hammer so I can ban? (Unless they are a role above me. :V)');
		}
		if (!message.member.hasPermission('BAN_MEMBERS', false, true, true)) {
			return message.channel.send('Hold up! Since when can you smash the hammer on someone of higher level than you?');
		}
		if(!reason) reason = 'No reason provided';
		if (!member) return message.channel.send('You need to provide a user ID or a mention.');
		message.guild.members.ban(member, reason)
			.then(m => m.send(`You have been banned from ${message.guild.name} for the following reason: ${reason}`))
			.catch(error => message.channel.send(`Woops! There was a problem banning this person. Be sure to report this error to the bot maker: ${error}`));
		message.channel.send(`${member.user.tag ? member.user.tag : member.tag} has been banned by ${message.author.tag} for: ${reason}`);
	},
};
