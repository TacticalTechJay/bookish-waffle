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

const MODE = Number(process.env.MODE);
const prefix = MODE ? stable.prefix : beta.prefix;

const { Client, Collection } = require('discord.js');
const client = new Client({ disableMentions: 'everyone', messageCacheMaxSize: 100, messageCacheLifetime: 3600, messageSweepInterval: 7200, presence: {
		status: 'dnd',
		activity: {
			name: `${prefix}help`,
			type: 'LISTENING'
		}
	},
	ws: {
		intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_BANS', 'GUILD_VOICE_STATES', 'GUILD_PRESENCES']
	},
	disabledEvents: [
		'GUILD_MEMBER_UPDATE',
		'GUILD_MEMBERS_CHUNK',
		'GUILD_INTEGRATIONS_UPDATE',
		'GUILD_ROLE_CREATE',
		'GUILD_ROLE_DELETE',
		'GUILD_ROLE_UPDATE',
		'GUILD_BAN_ADD',
		'GUILD_BAN_REMOVE',
		'GUILD_EMOJIS_UPDATE',
		'CHANNEL_PINS_UPDATE',
		'CHANNEL_CREATE',
		'CHANNEL_DELETE',
		'CHANNEL_UPDATE',
		'MESSAGE_DELETE',
		'MESSAGE_UPDATE',
		'MESSAGE_DELETE_BULK',
		'MESSAGE_REACTION_REMOVE',
		'MESSAGE_REACTION_REMOVE_ALL',
		'USER_UPDATE',
		'USER_SETTINGS_UPDATE',
		'PRESENCE_UPDATE',
		'TYPING_START',
		'WEBHOOKS_UPDATE'
	]
});
const { KoFi } = require('kofi.js');
const DBL = require('dblapi.js');

client.utils = require('./utils/index.js');
client.queue = new Map();
client.prefix = MODE ? stable.prefix : beta.prefix;
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

client.login(process.env.DISCORD_TOKEN);

client.utils.loaders.loadCommands(client);
client.utils.loaders.loadEvents(client);