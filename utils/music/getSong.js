const { MessageEmbed, Util } = require('discord.js')
module.exports = async (string, message, isSearch, client) => {
    require('./getSongs.js')(string, client).then(async song => {
		if (!song) return message.channel.send('No tracks were found');
		if (!client.queue.get(message.guild.id)) require('./createQueue.js')(message.guild.id);

		let thu = song.tracks[0].info.identifier;
		if (song.playlistInfo.name) {
			const tracks = song.tracks;
			let player = client.manager.players.get(message.guild.id);
			if (!player) await require('./join.js')(message, client);
			player = client.manager.players.get(message.guild.id);


			if (player.playing === false) {
				tracks.forEach(t => {
					t.requester = message.author;
					client.queue.get(message.guild.id).songs.push(t);
				});
				require('./play.js')(message, tracks[0].track, client);
				const em = new MessageEmbed()
					.setTitle('Now Playing Playlist')
					.setColor(0x2daa4b)
					.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
					.setDescription(`Title: **${Util.escapeMarkdown(song.playlistInfo.name)}**\nSong Amount: ${song.tracks.length}`);
				return message.channel.send(em);
			}
			else {
				tracks.forEach(t => {
					t.requester = message.author;
					client.queue.get(message.guild.id).songs.push(t);
				});
				const em = new MessageEmbed()
					.setTitle('Added Playlist to Queue')
					.setColor(0x2697ff)
					.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
					.setDescription(`Title: ${song.playlistInfo.name}\nSong Amount: ${song.tracks.length}`);
				return message.channel.send(em);
			}
		}

		if (!client.manager.players.get(message.guild.id)) await require('./join.js')(message, client);
		const player = client.manager.players.get(message.guild.id);

		if (player.playing === false) {
				require('./askWhich.js')(song, message, isSearch, client).then(async response => {
					if (!response) return;
					if (response.first().content.toLowerCase() == `${client.prefix}search`) return;
					if (response.first().content.toLowerCase() == 'cancel') {
						message.channel.messages.fetch(a.id).then(m => m.delete());
						client.queue.delete(message.guild.id);
						client.manager.leave(message.guild.id);
						return message.channel.send('Cancelled. Gone. Reduced to atoms.');
					}
					const r = response.first().content - 1;
					require('./play.js')(message, song.tracks[r].track, client);
					thu = song.tracks[r].info.identifier;
					message.channel.messages.fetch(a.id).then(m => m.delete());
					song.tracks[r].requester = message.author;
					client.queue.get(message.guild.id).songs.push(song.tracks[r]);
					const em = new MessageEmbed()
						.setTitle('Now Playing:')
						.setColor(0x2daa4b)
						.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
						.setDescription(`Title: [${Util.escapeMarkdown(song.tracks[r].info.title)}](${song.tracks[r].info.uri})\nAuthor: ${Util.escapeMarkdown(song.tracks[r].info.author)}`);
					return message.channel.send(em);
				}).catch(e => {
					if (!e) {
						message.channel.messages.get(a.id).delete();
						client.queue.delete(message.guild.id);
						client.manager.leave(message.guild.id);
						return message.channel.send('There was no response.');
					}
					console.error(e);
				});
			if (!isSearch) {
				song.tracks[0].requester = message.author;
				require('./play.js')(message, song.tracks[0].track, client);
				client.queue.get(message.guild.id).songs.push(song.tracks[0]);
				const em = new MessageEmbed()
					.setTitle('Now Playing:')
					.setColor(0x2daa4b)
					.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
					.setDescription(`Title: [${Util.escapeMarkdown(song.tracks[0].info.title)}](${song.tracks[0].info.uri})\nAuthor: ${Util.escapeMarkdown(song.tracks[0].info.author)}\nLength: ${require('moment').utc(song.tracks[0].info.length).format('H:mm:ss')}`);
				return message.channel.send(em);
			}
		}
		else {
			require('./askWhich.js')(song, message, isSearch, client).then(async response => {
				if (!response) return;
				if (response.first().content.toLowerCase() == `${client.prefix}search`) return;
				if (response.first().content.toLowerCase() == 'cancel') {
					message.channel.messages.fetch(a.id).then(m => m.delete());
					return message.channel.send('Cancelled. Gone. Reduced to atoms.');
				}
				const r = response.first().content - 1;
				thu = song.tracks[r].info.identifier;
				message.channel.messages.fetch(a.id).then(m => m.delete());
				song.tracks[response.first().content - 1].requester = message.author;
				client.queue.get(message.guild.id).songs.push(song.tracks[response.first().content - 1]);
				const em = new MessageEmbed()
					.setTitle('Added To Queue:')
					.setColor(0x2697ff)
					.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
					.setDescription(`
					Title: [${Util.escapeMarkdown(song.tracks[response.first().content - 1].info.title)}](${song.tracks[response.first().content - 1].info.uri})\nAuthor: ${Util.escapeMarkdown(song.tracks[response.first().content - 1].info.author)}
					`);
				return message.channel.send(em);
			}).catch(e => {
				if (e.size == 0) {
					message.channel.messages.cache.get(a.id).delete();
					return message.channel.send('There was no response');
				}
				console.error(e);
			});
			if (!isSearch) {
				song.tracks[0].requester = message.author;
				client.queue.get(message.guild.id).songs.push(song.tracks[0]);
				const em = new MessageEmbed()
					.setTitle('Added To Queue:')
					.setColor(0x2697ff)
					.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
					.setDescription(`
					Title: [${Util.escapeMarkdown(song.tracks[0].info.title)}](${song.tracks[0].info.uri})\nAuthor: ${Util.escapeMarkdown(song.tracks[0].info.author)}\nLength: ${require('moment').utc(song.tracks[0].info.length).format('H:mm:ss')}
					`);
				return message.channel.send(em);
			}
		}
	}).catch(err => {
		console.log(err);
		return message.channel.send('There was an error. ' + err);
	});

}