const { ShardingManager } = require('discord.js');

if (!parseInt(process.env.MODE)) {
	const { beta_token } = require('./config.json');
	const manager = new ShardingManager('./bot.js', { token: beta_token, shardArgs: ['--ansi', '--color', '--trace-warnings'] });
	manager.spawn();
	manager.on('shardCreate', shard => {
		console.log(`Launched shard ${shard.id}`);
	});
}
else if (parseInt(process.env.MODE)) {
	const { token } = require('./config.json');
	const manager = new ShardingManager('./bot.js', { token, shardArgs: ['--ansi', '--color', '--trace-warnings'] });
	manager.spawn();
	manager.on('shardCreate', shard => {
		console.log(`Launched shard ${shard.id}`);
	});
}
