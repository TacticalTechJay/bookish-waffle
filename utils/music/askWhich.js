const { MessageEmbed, Util } = require('discord.js');
module.exports = async (song, message, isSearch, client) => {
    if (!isSearch) return;
	let i = 0;
	song.tracks.length = 10;
	const em1 = new MessageEmbed()
		.setTitle('Pick a song!')
				.setDescription(song.tracks.map(t => `**${++i}** - ${Util.escapeMarkdown(t.info.title)} by ${Util.escapeMarkdown(t.info.author)}`).join('\n'))
				.setFooter('Say "cancel" to cancel the selection!');
	message.channel.send(em1).then(m => a = m);
	return await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content <= 10 && message.author == message2.author || message2.content.toLowerCase().startsWith(`${client.prefix}search`) || message2.content.toLowerCase() == 'cancel', {
		max: 1,
		time: 20000,
		errors: ['time']
	});
};