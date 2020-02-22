String.prototype.titleCase = function () {
   var splitStr = this.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
   }
   return splitStr.join(' '); 
}
const fs = require('fs');
const Discord = require('discord.js');
let { token, prefix, nodes, dblToken, ADLToken, mongo } = require('./config.json');
const client = new Discord.Client({ disableEveryone: true, messageCacheMaxSize: 100, messageCacheLifetime: 3600, messageSweepInterval: 7200 });
const { PlayerManager } = require('discord.js-lavalink');
const fetch = require('node-fetch');
const { KoFi } = require('kofi.js');
const DBL = require('dblapi.js');
client.prefix = prefix

if (process.env.MODE == 0) {
	const kofi = new KoFi('/notdonation', 4200);
	client.dbl = new DBL(dblToken, client);
	client.prefix = `${process.env.PREFIX} `;
	kofi.start(() => {
		console.log('Started on port 4200');
	});
	client.dbl.on('error', e => {
		console.error(e);
	});
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


client.queue = new Map();
client.commands = new Discord.Collection();
client.fetchSongs = async (string, amount) => {
	const search = encodeURIComponent(string);
	if (!amount) throw 'SEARCH LIMIT REQUIRED';
	const res = await fetch(`http://${client.lavalink.host}:${client.lavalink.port}/loadtracks?identifier=${search}`, {
		headers: { 'Authorization': client.lavalink.password }
	}).catch(err => {
		console.error(err);
		throw err;
	});
	const res2 = await res.json();
	if (!res2) throw 'NO RESPONSE';
	if (!res2.tracks) return 'NO TRACKS';
	res2.tracks.length = parseInt(amount);
	if (typeof res2.tracks.length == 'NaN') throw 'IMPROPER AMOUNT'
	return res2.tracks;
};
client.fetchInfo = async (string, amount) => {
	const search = encodeURIComponent(string);
        const res = await fetch(`http://${client.lavalink.host}:${client.lavalink.port}/loadtracks?identifier=${search}`, {
                headers: { 'Authorization': client.lavalink.password }
        }).catch(err => {
                console.error(err);
                throw err;
        });
        const res2 = await res.json();
        if (!res2) throw 'NO RESPONSE';
        return res2;
};


client.db = require('quick.db');
client.qsaves = new client.db.table('qsaves');
client.mongoose = require('mongoose');
client.mongoose.connect(`mongodb://jay:1234@${mongo.ip}:27017/test`, {useNewUrlParser: true, useUnifiedTopology: true});
client.mongoose.connection.on('error', console.error.bind(console, "connection error:"));
client.mongoose.connection.once('open', function() {
	console.log('Connection successful with MongoDB!')
});
client.mongoose.UserModel = require('./Schema/UserSchema.js');

client.nekosSafe = new (require('nekos.life'))().sfw;
client.nekosUnSafe = new (require('nekos.life'))().nsfw;
client.pushStats = async (Token) => {
	const body = {
		'users': client.users.cache.size,
		'servers': client.guilds.cache.size,
		'shards': client.shard.count
	};
	const res = await fetch(`https://abstractlist.net/api/bot/${client.user.id}/stats`, {
		method: 'post',
		body: JSON.stringify(body),
		headers: {
			'Content-type': 'application/json', 'Authorization': Token
		}
	});
	return await res.json();
};
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
delete client.nekosUnSafe.neko;
delete client.nekosUnSafe.avatar;
if (process.env.MODE == 0) {
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
}
const cooldowns = new Discord.Collection();
client.on('ready', async () => {

	console.log('Ready!');
	client.user.setActivity(`${client.prefix}help for help.`)
		.then(presence => console.log(`Activity is ${presence.activities[0] ? presence.activities[0].name : 'none'}`))
		.catch(console.error);
	client.lavalink = {
		host: nodes[0].host,
		password: nodes[0].password,
		port: nodes[0].port
	};
	client.manager = new PlayerManager(client, nodes, {
		user: client.user.id,
		shards: client.shard.count
	});
	try {
		setInterval(async () => {
			const body = {
				'users': client.users.cache.size,
				'servers': client.guilds.cache.size,
				'shards': client.shard.count
			};
			await fetch(`https://abstractlist.net/api/bot/${client.user.id}/stats`, {
				method: 'post',
				body: JSON.stringify(body),
				headers: { 'Content-type': 'application/json', 'Authorization': ADLToken }
			});
		}, 1800000);
	} catch(e) {
		console.error(e);
	}

});
client.login(process.env.DISCORD_TOKEN);
client.on('error', console.error);
client.on('disconnect', console.log);
client.on('guildCreate', g => {
	if (!g.available) return;
	const embed = new Discord.MessageEmbed()
		.setTitle('Guild added.')
		.addField('Guild Name', g.name)
		.addField('Guild ID', g.id)
		.addField('Guild Onwer', g.owner.user.username)
		.addField('Guild Members (Excluding bots)', g.members.cache.filter(m => !m.user.bot).size)
		.setColor('GREEN');
	return client.channels.cache.get('661669168009052200').send(embed);
});
client.on('guildDelete', g => {
	if (!g.available) return;
	const embed = new Discord.MessageEmbed()
		.setTitle('Guild removed.')
		.addField('Guild Name', g.name)
		.addField('Guild ID', g.id)
		.addField('Guild Onwer', g.owner.user.username)
		.addField('Guild Members (Excluding bots)', g.members.cache.filter(m => !m.user.bot).size)
		.setColor('RED');
	return client.channels.cache.get('661669168009052200').send(embed);
});
client.on('voiceStateUpdate', (oldState, newState) => {
	if (newState.member == newState.guild.me) {
		if (oldState === 'No need') return;
		if (!oldState.channel) return;
		if (!newState.channel) {
			if (!client.queue.get(newState.guild.id) && !client.manager.get(newState.guild.id)) return;
			try {
				client.queue.delete(newState.guild.id);
				console.log(newState.guild.name + ' disconnected the bot and did not have a queue.');
			} catch (e) {
				console.error(e);
			}
			try {
				client.manager.leave(newState.guild.id);
				console.log(newState.guild.name + ' disconnected the bot and had manager still active.');
			} catch (e) {
				console.error(e);
			}
			client.queue.delete(newState.guild.id);
			return client.manager.get(newState.guild.id);
		}
	}
})

client.on('message', async (message) => {
	if (!message.content.toLowerCase().startsWith(client.prefix) || message.author.bot) return;
	const args = message.content.slice(client.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) ||
		client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;
	if (typeof client.dbl !== 'undefined') {
		const voted = await client.dbl.hasVoted(message.author.id);
		if (command.voterOnly && !command.donatorOnly && !voted) return message.channel.send('Woah there! This command is for voters only! Vote on DBL to use this command. Vote here!\n<https://top.gg/bot/628802763123589160/vote>');
		if (command.donatorOnly && !command.voterOnly && !client.db.get('donor').includes(`member_${message.author.id}`)) return message.channel.send(`Woah there! This command is for donators only! Donate more than one cup of coffee on KoFi to use these commands (Be sure to include your user ID: \`${message.author.id}\`). Donation link: <https://www.ko-fi.com/earthchandiscord>`);
		if (command.voterOnly && command.donatorOnly && !voted && !client.db.get('donor').includes(`member_${message.author.id}`)) return message.channel.send(`Woah there! This command is only for voters/donators! Vote on Discord Bot List to use this command or donate more than just a cup off coffee on KoFi with your user ID in the message (\`${message.author.id}\`) included in the message.\nDonation link: <https://www.ko-fi.com/earthchandiscord>\nVote link: <https://top.gg/bot/628802763123589160/vote>`);
	};
	if (command.testing && message.author.id != 127888387364487168) return message.reply(`${command.name} is currently in its testing stage.`);
	if (command.guildOnly && message.channel.type !== 'text') return message.reply('I can\'t execute that command inside DMs!');

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${client.prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	const cooldownDonAmount = ((command.cooldown-2 < 0 ? 1 : command.cooldown-2)) * 1000;

	if (!timestamps.has(message.author.id)) {
		timestamps.set(message.author.id, now);
		if (client.db.get('donor').includes(`member_${message.author}`)) setTimeout(() => timestamps.delete(message.author.id), cooldownDonAmount)
		else setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
	}
	else {
		let expirationTime;
		if (client.db.get('donor').includes(`member_${message.author.id}`)) expirationTime = timestamps.get(message.author.id) + cooldownDonAmount
		else expirationTime = timestamps.get(message.author.id) + cooldownAmount

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	try {
		command.execute(message, args, client);
	}
	catch (error) {
		console.error(`${message.guild.id} | ${command.name}:\n${error.stack}`);
		message.reply(`there was an error trying to execute that command! Report this to the creator of this bot: \`${error}\``);
	}
});

// START MUSIC RELATED FUNCTIONS 
client.getSongs = async (string, client) => {
	const fetch = require('node-fetch');
	const res = await fetch(`http://${client.lavalink.host}:${client.lavalink.port}/loadtracks?identifier=${string}`, {
		headers: { 'Authorization': client.lavalink.password }
	}).catch(err => {
		console.error(err)
		return null;
	});
	const res2 = await res.json()
	if (!res2) throw 'NO RESPONSE';
	if (!res2.tracks) throw 'NO TRACKS';
	return res2;
}
client.createQueue = (client, guild) => {
	client.queue.set(guild, {
		songs: [],
		looping: false
	});
}
client.askWhich = async (song, message, isSearch) => {
	if (!isSearch) return;
	let i = 0;
	song.tracks.length = 10;
	let em1 = new Discord.MessageEmbed()
		.setTitle("Pick a song!")
				.setDescription(song.tracks.map(t => `**${++i}** - ${Discord.Util.escapeMarkdown(t.info.title)} by ${Discord.Util.escapeMarkdown(t.info.author)}`).join('\n'))
				.setFooter('Say "cancel" to cancel the selection!');
	message.channel.send(em1).then(m => a = m);
	return await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 10 && message.author == message2.author || message2.content.toLowerCase().startsWith(`${client.prefix}search`) || message2.content.toLowerCase() == 'cancel', {
		max: 1,
		time: 15000,
		errors: ['time']
	})
}
client.getSong = (string, message, client, isSearch) => {
	client.getSongs(string, client).then(async song => {
		if (!song) return message.channel.send('No tracks were found');
		if (!client.queue.get(message.guild.id)) client.createQueue(client, message.guild.id);

		let thu = song.tracks[0].info.identifier

		if (song.playlistInfo.name) {
			const tracks = song.tracks;
			let player = client.manager.get(message.guild.id);
			if (!player) await client.join(client, message);
			player = client.manager.get(message.guild.id);


			if (player.playing === false) {
				tracks.forEach(t => {
					t.requester = message.author;
					client.queue.get(message.guild.id).songs.push(t);
				})
				client.play(client, message, tracks[0].track);
				const em = new Discord.MessageEmbed()
					.setTitle('Now Playing Playlist')
					.setColor(0x2daa4b)
					.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
					.setDescription(`Title: **${song.playlistInfo.name}**\nSong Amount: ${song.tracks.length}`);
				return message.channel.send(em);
			} else {
				tracks.forEach(t => {
					t.requester = message.author;
					client.queue.get(message.guild.id).songs.push(t);
				})
				const em = new Discord.MessageEmbed()
					.setTitle('Added Playlist to Queue')
					.setColor(0x2697ff)
					.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
					.setDescription(`Title: ${song.playlistInfo.name}\nSong Amount: ${song.tracks.length}`);
				return message.channel.send(em);
			}
		}


		if (!client.manager.get(message.guild.id)) await client.join(client, message);
		let player = client.manager.get(message.guild.id);
		
		if (player.playing === false) {
				client.askWhich(song, message, isSearch).then(async response => {
					if (!response) return;
					if (response.first().content.toLowerCase() == `${client.prefix}search`) return;
					if (response.first().content.toLowerCase() == 'cancel') {
						message.channel.messages.fetch(a.id).then(m => m.delete());
						client.queue.delete(message.guild.id);
						client.manager.leave(message.guild.id);
						return message.channel.send('Cancelled. Gone. Reduced to atoms.')
					}
					const r = response.first().content - 1;
					client.play(client, message, song.tracks[r].track);
					thu = song.tracks[r].info.identifier;
					message.channel.messages.fetch(a.id).then(m => m.delete());
					song.tracks[r].requester = message.author;
					client.queue.get(message.guild.id).songs.push(song.tracks[r]);
					const em = new Discord.MessageEmbed()
						.setTitle('Now Playing:')
						.setColor(0x2daa4b)
						.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
						.setDescription(`
						Title: [${song.tracks[r].info.title}](${song.tracks[r].info.uri})\nAuthor: ${song.tracks[r].info.author}
						`);
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
				client.play(client, message, song.tracks[0].track);
				client.queue.get(message.guild.id).songs.push(song.tracks[0]);
				const em = new Discord.MessageEmbed()
					.setTitle('Now Playing:')
					.setColor(0x2daa4b)
					.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
					.setDescription(`
				Title: [${song.tracks[0].info.title}](${song.tracks[0].info.uri})\nAuthor: ${song.tracks[0].info.author}\nLength: ${require('moment').utc(song.tracks[0].info.length).format('H:mm:ss')}
				`);
				return message.channel.send(em);
			}
		}
		else {
			client.askWhich(song, message, isSearch).then(async response => {
				if (!response) return;
				if (response.first().content.toLowerCase() == `${client.prefix}search`) return;
				if (response.first().content.toLowerCase() == 'cancel') {
					message.channel.messages.fetch(a.id).then(m => m.delete());
					return message.channel.send('Cancelled. Gone. Reduced to atoms.')
				}
				let r = response.first().content - 1;
				thu = song.tracks[r].info.identifier;
				message.channel.messages.fetch(a.id).then(m => m.delete());
				song.tracks[response.first().content - 1].requester = message.author;
				client.queue.get(message.guild.id).songs.push(song.tracks[response.first().content - 1]);
				let em = new Discord.MessageEmbed()
					.setTitle('Added To Queue:')
					.setColor(0x2697ff)
					.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
					.setDescription(`
					Title: [${song.tracks[response.first().content - 1].info.title}](${song.tracks[response.first().content - 1].info.uri})\nAuthor: ${song.tracks[response.first().content - 1].info.author}
					`);
				return message.channel.send(em);    
			}).catch(e => {
				if (e.size == 0) {
					message.channel.messages.get(a.id).delete();
					return message.channel.send('There was no response')
				};
				console.error(e);
			})
			if (!isSearch) {
				song.tracks[0].requester = message.author;
				client.queue.get(message.guild.id).songs.push(song.tracks[0]);
				const em = new Discord.MessageEmbed()
					.setTitle('Added To Queue:')
					.setColor(0x2697ff)
					.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
					.setDescription(`
					Title: [${song.tracks[0].info.title}](${song.tracks[0].info.uri})\nAuthor: ${song.tracks[0].info.author}\nLength: ${require('moment').utc(song.tracks[0].info.length).format('H:mm:ss')}
					`);
				return message.channel.send(em);
			}
		}
	}).catch(err => {
		console.log(err);
		return message.channel.send('There was an error. ' + err);
	});
}
client.play = (client, message, track) => {
	try {
		const queue = client.queue.get(message.guild.id);
		let player = client.manager.get(message.guild.id);
		player.play(track);
		player.once('end', async data => {

			if (queue.looping == true) return client.play(client, message, queue.songs[0].track)
			queue.songs.shift();

			if (!queue.songs.length) {
				return client.leave(client, message);
			}
			const thu = queue.songs[0].info.identifier;
			client.play(client, message, queue.songs[0].track);
			const em = new Discord.MessageEmbed()
				.setTitle('Now Playing:')
				.setColor(0x2daa4b)
				.setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
				.setDescription(`
	Title: [${queue.songs[0].info.title}](${queue.songs[0].info.uri})\nAuthor: ${queue.songs[0].info.author}
	`);
			return message.channel.send(em);

		});
	}
	catch (err) {
		console.log(err);
	}
}
client.join = async(client, message) => {
	await client.manager.join({
		guild: message.guild.id,
		channel: message.member.voice.channel.id,
		host: client.lavalink.host
	}, {
		selfdeaf: true
	});
	await client.manager.get(message.guild.id).volume(50);
	console.log(`A player has spawned in ${message.guild.name} (${message.guild.id})`);
}
client.leave = async(client, message) => {
	client.queue.delete(message.guild.id);
	message.channel.send('It appears as though there are no tracks playing. :thinking:');
	console.log(`A player has despawned in ${message.guild.name} (${message.guild.id})`);
	return await client.manager.leave(message.guild.id);
}
