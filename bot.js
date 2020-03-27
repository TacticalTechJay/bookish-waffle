String.prototype.titleCase = function() {
	const splitStr = this.toLowerCase().split(' ');
	for (let i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	return splitStr.join(' ');
};
Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
};
String.prototype.toProperCase = function () {
	return this.toLowerCase().replace(/(^|[\s.])[^\s.]/gm, (s) => s.toUpperCase())
}

const fs = require('fs');
const { MessageEmbed, Client, Collection, Util } = require('discord.js');
const { prefix, dblToken } = require('./config.json');
const client = new Client({ disableEveryone: true, messageCacheMaxSize: 100, messageCacheLifetime: 3600, messageSweepInterval: 7200 });
const fetch = require('node-fetch');
const { KoFi } = require('kofi.js');
const DBL = require('dblapi.js');
const { walk } = require('walk');
const { resolve } = require('path');
let a;
client.prefix = prefix;

client.queue = new Map();
client.commands = new Collection();

client.db = require('quick.db');
client.qsaves = new client.db.table('qsaves');

client.nekosSafe = new (require('nekos.life'))().sfw;
client.nekosUnSafe = new (require('nekos.life'))().nsfw;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
delete client.nekosUnSafe.neko;
delete client.nekosUnSafe.avatar;
if (parseInt(process.env.MODE)) {
	Object.entries(client.nekosUnSafe).map(x => {
		client.commands.set(x[0].toLowerCase(), {
			name: x[0].toLowerCase(),
			description: 'Just your average lewd',
			category: 'nsfw',
			cooldown: 5,
			voterOnly: true,
			donatorOnly: true,
			async execute(message) {
				if (!message.channel.nsfw) return message.channel.send('Nope. It\'s lewd. (Use the command in an nsfw channel.)');
				message.channel.send(new (require('discord.js').MessageEmbed)().setImage((await x[1]()).url));
			}
		});
	});
	
	const kofi = new KoFi('/notdonation', 4200);
	client.dbl = new DBL(dblToken, client);
	client.prefix = `${process.env.PREFIX} `;
	kofi.start(() => {
		console.log('Started on port 4200');
	});

	function a() {
		client.dbl.on('error', e => {
			console.error(e);
			delete client.dbl;
			setTimeout(() => {
				client.dbl = new DBL(dblToken, client);
				a();
			}, 3600000)
		});
	}
	a();
	kofi.on('donation', donation => {
		const amount = parseInt(donation.amount);
		const id = parseInt(donation.message);
		client.db.push('donations', donation);
		if (amount < 3) return;
		if (!donation.message || isNaN(id)) return;
		if (!client.db.get('donor').includes(`member_${id}`)) return;
		client.db.push('donor', `member_${id}`);
	});
}
const cooldowns = new Collection();

client.login(process.env.DISCORD_TOKEN);

const walker = walk('./events');
walker.on('file', async (root, stats, next) => {
	const event = require(`${resolve(root)}/${stats.name}`);
	client.on(event.name, (...args) => {
		event.exec(...args, client, cooldowns);
	});
	next();
});

// START MUSIC RELATED FUNCTIONS
let i = 1;
async function get() {
	const url = new URL(`http://${client.lavalink.host}:${client.lavalink.port}/loadtracks?identifier=${string}`)
	const res = await fetch(url, {
		headers: { 'Authorization': client.lavalink.password }
	}).catch(err => {
		console.error(err);
		return null;
	});
	const res2 = await res.json();
	if (i == 3) throw 'NO_MATCHES';
	if (res2.loadType == 'NO_MATCHES') {
		++i
		return get();
	}
	return res2;
}
client.getSongs = async (string) => {
	let i = 1;
	try {
		const res2 = await get();
	} catch(e) {
		if (e == 'NO_MATCHES') throw 'NO MATCHES';
	}
	const res2 = await get();
	if (!res2) throw 'NO RESPONSE';
	if (!res2.tracks) throw 'NO TRACKS';
	return res2;
};
client.createQueue = (guild, channel) => {
	client.queue.set(guild, {
		songs: [],
		looping: 'none',
		pb: true,
		channel: channel
	});
};
client.askWhich = async (song, message, isSearch) => {
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
client.getSong = (string, message, isSearch) => {
	client.getSongs(string).then(async song => {
		if (!song) return message.channel.send('No tracks were found');
		if (!client.queue.get(message.guild.id)) client.createQueue(message.guild.id);

		let thu = song.tracks[0].info.identifier;
		if (song.playlistInfo.name) {
			const tracks = song.tracks;
			let player = client.manager.players.get(message.guild.id);
			if (!player) await client.join(message);
			player = client.manager.players.get(message.guild.id);


			if (player.playing === false) {
				tracks.forEach(t => {
					t.requester = message.author;
					client.queue.get(message.guild.id).songs.push(t);
				});
				client.play(message, tracks[0].track);
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

		if (!client.manager.players.get(message.guild.id)) await client.join(message);
		const player = client.manager.players.get(message.guild.id);

		if (player.playing === false) {
				client.askWhich(song, message, isSearch).then(async response => {
					if (!response) return;
					if (response.first().content.toLowerCase() == `${client.prefix}search`) return;
					if (response.first().content.toLowerCase() == 'cancel') {
						message.channel.messages.fetch(a.id).then(m => m.delete());
						client.queue.delete(message.guild.id);
						client.manager.leave(message.guild.id);
						return message.channel.send('Cancelled. Gone. Reduced to atoms.');
					}
					const r = response.first().content - 1;
					client.play(message, song.tracks[r].track);
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
				client.play(message, song.tracks[0].track);
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
			client.askWhich(song, message, isSearch).then(async response => {
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
};
client.play = (message, track) => {
	try {
		const queue = client.queue.get(message.guild.id);
		const player = client.manager.players.get(message.guild.id);
		player.play(track);
		player.once('end', async () => {

			if (queue.looping == 'song') {
				client.play(message, queue.songs[0].track);
				const thu = queue.songs[0].info.identifier;
				if (!queue.pb) return;
				const em = new MessageEmbed()
					.setTitle('Now Playing:')
					.setColor(0x2daa4b)
					.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
					.setDescription(`Title: [${Util.escapeMarkdown(queue.songs[0].info.title)}](${queue.songs[0].info.uri})\nAuthor: ${Util.escapeMarkdown(queue.songs[0].info.author)}`);
				return message.channel.send(em);
			}
			if (queue.looping == 'queue') {
				queue.songs.push(queue.songs.shift());
				const thu = queue.songs[0].info.identifier;
				client.play(message, queue.songs[0].track);
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
				return client.leave(message);
			}
			const thu = queue.songs[0].info.identifier;
			client.play(message, queue.songs[0].track);
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
};
client.join = async (message) => {
	await client.manager.join({
		guild: message.guild.id,
		channel: message.member.voice.channel.id,
		node: client.lavalink.id
	});
	await client.manager.players.get(message.guild.id).volume(50);
	console.log(`A player has spawned in ${message.guild.name} (${message.guild.id})`);
};
client.leave = async (message) => {
	client.queue.delete(message.guild.id);
	message.channel.send('It appears as though there are no tracks playing. :thinking:');
	console.log(`A player has despawned in ${message.guild.name} (${message.guild.id})`);
	return await client.manager.leave(message.guild.id);
};
