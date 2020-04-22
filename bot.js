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
const dblToken = parseInt(process.env.MODE) ? stable.dblToken : beta.dblToken;
const Utils = require('./utils/index.js')
const { QuickPG } = require('quick.pg');

client.prefix = parseInt(process.env.MODE) ? stable.prefix : beta.prefix;
client.queue = new Map();
client.commands = new Collection();

client.pg = {
	donations: new QuickPG(sys.postgres, {table: 'donations'}),
	qsaves: new QuickPG(sys.postgres, {table: 'qsaves'})
}
setInterval(async () => {
	client.donations = await client.pg.donations.all();
	client.qsaves = await client.pg.qsaves.all()
}, 15000)

client.nekosSafe = new (require('nekos.life'))().sfw;
client.nekosUnSafe = new (require('nekos.life'))().nsfw;

delete client.nekosUnSafe.neko;
delete client.nekosUnSafe.avatar;
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

if (parseInt(process.env.MODE)) {
	const kofi = new KoFi(sys.kofi.webhook, sys.kofi.port);
	kofi.start(() => {
		console.log(`Started on port ${sys.kofi.port}`);
	});
	kofi.on('donation', async donation => {
		const amount = parseInt(donation.amount);
		const id = parseInt(donation.message);
		const users = await client.pg.donations.get('donorList')
		await client.pg.donations.push('donorInf', donation);
		if (amount < 3) return;
		if (!donation.message || isNaN(id)) return;
		if (users.include(`user_${id}`)) return;
		await client.pg.donations.push('donorList', `user_${id}`);
	});
}

client.dbl = new DBL(dblToken, client);
let b = 0;
async function a() {
	client.dbl.on('error', e => {
		console.error(e);
		delete client.dbl;
		if (b == 5) return new Error("DBL won't get initialized after 5 errors. Remaining yeeted.");
		b++;
		setTimeout(() => {
			client.dbl = new DBL(stable.dblToken, client);
			a();
		}, 3600000);
	});
	const donorListExistence = await client.pg.donations.exists("donorList");
	if (!donorListExistence) await client.pg.donations.set('donorList', []);
	client.donations = await client.pg.donations.all();
	client.qsaves = await client.pg.qsaves.all()
}
a();


client.login(process.env.DISCORD_TOKEN);

Utils.loaders.loadCommands(client);
Utils.loaders.loadEvents(client);