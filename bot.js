const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, nodes, dblToken, ADLToken } = require('./config.json');
const client = new Discord.Client({ disableEveryone: true });
const { exec } = require('child_process');
const { PlayerManager } = require('discord.js-lavalink');
const DBL = require('dblapi.js');
const dbl = new DBL(dblToken, client);
const fetch = require('node-fetch');

dbl.on('error', e => {
	console.error(e);
});

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
	const res2 = await res.json()
	if (!res2) throw 'NO RESPONSE';
	if (!res2.tracks) return 'NO TRACKS';
	res2.tracks.length = parseInt(amount);
	return res2.tracks;
}
client.db = require('quick.db');
client.nekos = new (require('nekos.life'))().sfw;

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();

client.on('ready', async () => {

	console.log('Ready!');
	client.user.setActivity('plana help for help.')
		.then(presence => console.log(`Activity is ${presence.activity ? presence.activity.name : 'none'}`))
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
				'token': ADLToken,
				'users': client.users.size,
				'servers': client.guilds.size,
				'shards': client.shard.count
			}
			const res = await fetch(`https://abstractlist.net/api/bot/${client.user.id}/stats`, {
				method: 'post',
				body: JSON.stringify(body),
				headers: { 'Content-type': 'application/json' }
			});
			console.log((await res.json()));
		}, 1800000)
	} catch(e) {
		console.error(e);
	}
});
client.login(token);
client.on('error', console.log);
client.on('disconnect', console.log);
client.on('guildCreate', g => {
	console.log(`Obtained guild: ${g.name} | ${g.id} | ${g.members.filter(m => !m.user.bot).size}`);
});
client.on('guildDelete', g => {
    console.log(`Lost guild: ${g.name} | ${g.id} | ${g.members.filter(m => !m.user.bot).size}`);
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

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) ||
		client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;
	if (command.testing && message.author.id != 127888387364487168) {
		return message.reply(`${command.name} is currently being tested and is not fully functional so it is disabled.`);
	}

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 1) * 1000;

	if (!timestamps.has(message.author.id)) {
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}
	else {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	try {
		command.execute(message, args, client, dbl);
	}
	catch (error) {
		console.error(error);
		message.reply(`there was an error trying to execute that command! Report this to the dorito maker: \`${error}\``);
	}
});

client.on('message', message => {
	const args = message.content.split(' ').slice(1);
	if (message.content.startsWith('plana exec')) {
		if (message.author.id !== '127888387364487168') return;
		if (!args[0]) return message.channel.send('```COMMAND REQUIRED```');
		try {
			exec(args.join(' '), (err, stdout, stderr) => {
				if (stderr) return message.channel.send({ embed: { description: stderr } });
				message.channel.send({ embed: { description: stdout } });
			});
		}
		catch (err) {
			console.log(err);
		}
	}
});
