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

const { Client, Collection } = require('discord.js');
const client = new Client({ disableMentions: 'everyone', messageCacheMaxSize: 100, messageCacheLifetime: 3600, messageSweepInterval: 7200 });
const { KoFi } = require('kofi.js');
const DBL = require('dblapi.js');
const MODE = Number(process.env.MODE);
const dblToken = MODE ? stable.dblToken : beta.dblToken;

client.utils = require('./utils/index.js');
client.prefix = MODE ? stable.prefix : beta.prefix;
client.queue = new Map();
client.commands = new Collection();

if (MODE) {
	const kofi = new KoFi(sys.kofi.webhook, sys.kofi.port);
	kofi.start(() => {
		console.log(`Started on port ${sys.kofi.port}`);
	});
	kofi.on('donation', async donation => {
		const amount = Number(donation.amount);
		const id = String(donation.message.replace(/[a-zA-Z]?\s?/gi, ''));

		if (!id) return;
		if (amount < 3) return;
		try {
			await client.users.fetch(id);
		} catch (e) {
			throw `Incorrect ID provided for the following donation:\n${donation}`;
		}

		const user = await client.utils.database.user(client, id);
		if (user.donator) return;
		user.donator = true;
		return await client.orm.repos.user.save();
	});
}

if (dblToken) client.dbl = new DBL(dblToken, client);
let b = 0;
async function usefullness() {
	if (!dblToken) throw new Error('No DBL token was provided');
	client.dbl.on('error', e => {
		console.error(e);
		delete client.dbl;
		if (b == 5) throw'DBL won\'t get initialized after 5 errors. Remaining yeeted.'
		b++;
		setTimeout(() => {
			client.dbl = new DBL(dblToken, client);
			return usefullness();
		}, 3600000);
	});
}
usefullness();

client.login(process.env.DISCORD_TOKEN);

client.utils.loaders.loadCommands(client);
client.utils.loaders.loadEvents(client);