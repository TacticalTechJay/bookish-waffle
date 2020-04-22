module.exports = async (message, track, client) => {
    const { Util, MessageEmbed } = require('discord.js');
    try {
		const queue = client.queue.get(message.guild.id);
		const player = client.manager.players.get(message.guild.id);
		player.play(track);
		player.once('end', async () => {
			if (queue.looping == 'song') {
				require('./play.js')(message, queue.songs[0].track, client);
				const thu = queue.songs[0].info.identifier;
				if (!queue.pb) return;
				const em = new MessageEmbed()
					.setTitle('Now Playing:')
					.setColor(0x2daa4b)
					.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
					.setDescription(`Title: [${Util.escapeMarkdown(queue.songs[0].info.title)}](${queue.songs[0].info.uri})\nAuthor: ${Util.escapeMarkdown(queue.songs[0].info.author)}`);
				return message.channel.send(em);
			} else if (queue.looping == 'queue') {
				queue.songs.push(queue.songs.shift());
				const thu = queue.songs[0].info.identifier;
				require('./play.js')(message, queue.songs[0].track, client);
				if (!queue.pb) return;
				const em = new MessageEmbed()
					.setTitle('Now Playing:')
					.setColor(0x2daa4b)
					.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
					.setDescription(`Title: [${Util.escapeMarkdown(queue.songs[0].info.title)}](${queue.songs[0].info.uri})\nAuthor: ${Util.escapeMarkdown(queue.songs[0].info.author)}`);
				return message.channel.send(em);
			}
			queue.songs.shift();

			if (!queue.songs.length) {
				return require('./leave.js')(message, client);
			}
			const thu = queue.songs[0].info.identifier;
			require('./play.js')(message, queue.songs[0].track, client);
			if (!queue.pb) return;
			const em = new MessageEmbed()
				.setTitle('Now Playing:')
				.setColor(0x2daa4b)
				.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
				.setDescription(`Title: [${Util.escapeMarkdown(queue.songs[0].info.title)}](${queue.songs[0].info.uri})\nAuthor: ${Util.escapeMarkdown(queue.songs[0].info.author)}`);
			return message.channel.send(em);

		});
	}
	catch (err) {
		console.log(err);
	}

}