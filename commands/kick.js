module.exports = {
	name: 'kick',
	description: 'Kick naughty users. >:C',
	category: 'moderation',
	guildOnly: true,
	args: true,
	usage: '<MemberMention/UserID>',
	execute(message, args) {
		const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.guild.members.find(m => m.nickname.startsWith(args[0]))
		if (!member) {
			return message.channel.send('Could not find the member. Try using their ID.');
		}
		if (member.user == message.author) {
			return message.channel.send('Why would you want to kick yoursef? :frowning:');
		}
		if (!message.guild.me.hasPermission('KICK_MEMBERS') || !member.kickable) {
			return message.channel.send('I do not have permissions to kick the person! They are either a role above me or I do not have permission to kick.');
		}
		if (!message.member.hasPermission('KICK_MEMBERS', false, true, true)) {
			return message.reply('sorry but you ain\'t got the strength to tag anyone down with this boot.');
		}
		const reason = args.slice(1).join(' ');
		if (!reason) {
			return member.kick('No reason given.')
				.then(message.reply(`${member.user.tag} has been kicked by ${message.author.tag} for the following reason: No reason given.`));
		}
		member.kick({reason: reason})
			.then(() => member.send(`You have been kicked from ${message.guild.id} for the following reason: ${reason}`))
			.catch(error => message.reply(`Sorry, I couldn't kick this user for a quite specific reason... Report this to the creator of this bot: ${error}`));
		return message.reply(`${member.user.tag} has been kicked by ${message.author.tag} for the following reason: ${reason}`);
	},
};
