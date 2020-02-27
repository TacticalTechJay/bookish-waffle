module.exports = {
	name: 'ping',
	description: 'Ping!',
	category: 'general',
	execute(message, a, client) {
		message.channel.send('Ping?').then(m => m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`));
	},
};
