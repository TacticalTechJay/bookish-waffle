const { stable, beta } = require('./config.json');
const { ShardingManager } = require('discord.js');

if (parseInt(process.env.MODE)) {
	if (!stable.token) throw 'NO TOKEN PROVIDED (STABLE)';
	const manager = new ShardingManager('./bot.js', { token: stable.token, shardArgs: ['--ansi', '--color', '--trace-warnings'] });
	manager.spawn();
	manager.on('shardCreate', shard => {
		console.log(`Launched shard ${shard.id}`);
	});
} else {
	if (!beta.token) throw 'NO TOKEN PROVIDED (BETA)';
	const manager = new ShardingManager('./bot.js', { token: beta.token, shardArgs: ['--ansi', '--color', '--trace-warnings'] });
	manager.spawn();
	manager.on('shardCreate', shard => {
		console.log(`Launched shard ${shard.id}`);
	});
}