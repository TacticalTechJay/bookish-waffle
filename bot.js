const { stable, beta, sys } = require('./config.json');
const Sentry = require('@sentry/node');
Sentry.init({ dsn: sys.dsn });

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
String.prototype.toProperCase = function() {
	return this.toLowerCase().replace(/(^|[\s.])[^\s.]/gm, (s) => s.toUpperCase());
};

const { MessageEmbed, Client, Collection, Util } = require('discord.js');
const client = new Client({ disableMentions: 'everyone', messageCacheMaxSize: 100, messageCacheLifetime: 3600, messageSweepInterval: 7200 });
const fetch = require('node-fetch');
const { KoFi } = require('kofi.js');
const DBL = require('dblapi.js');
const Utils = require('./utils/index.js')

client.prefix = parseInt(process.env.MODE) ? stable.prefix : beta.prefix;
client.queue = new Map();
client.commands = new Collection();

client.db = require('quick.db');
client.qsaves = new client.db.table('qsaves');

client.nekosSafe = new (require('nekos.life'))().sfw;
client.nekosUnSafe = new (require('nekos.life'))().nsfw;

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
	client.dbl = new DBL(stable.dblToken, client);
	kofi.start(() => {
		console.log('Started on port 4200');
	});
// eslint-disable-next-line
	function a() {
		client.dbl.on('error', e => {
			console.error(e);
			delete client.dbl;
			setTimeout(() => {
				client.dbl = new DBL(stable.dblToken, client);
				a();
			}, 3600000);
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

Utils.loaders.loadCommands(client);
Utils.loaders.loadEvents(client, cooldowns);