module.exports = {
	name: 'prune',
	description: 'Remove those messages all in one scoop!',
	category: 'moderation',
	guildOnly: true,
	testing: false,
	args: true,
	aliases: ['clear', 'purge'],
	usage: '<1-99>',
	execute(message, args) {
		if (!message.guild.me.hasPermission('MANAGE_MESSAGES', false, true, false)) {
			return message.channel.send('I do not have permissions to prune messages!');
		}
		if(!message.member.hasPermission('MANAGE_MESSAGES', false, true, true)) {
			return message.channel.send('You do not have permission to scoop up these messages.');
		}
		let deleteCount = parseInt(args[0], 10);

		if(!deleteCount || deleteCount < 1 || deleteCount > 99) {
			return message.reply('please do provide a number between 1 and 99 for the number of messages to delete.');
		}
		message.channel.messages.fetch({ limit: ++deleteCount })
			.then(function(list) {
				message.channel.bulkDelete(list)
					.catch(error => message.reply(`Couldn't delete message because of: ${error}`));
			})
	},
};
