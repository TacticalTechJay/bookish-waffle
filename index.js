const { ShardingManager, Shard } = require('discord.js');
const { token } = require('./config.json');
const manager = new ShardingManager('./bot.js', { token: token, shardArgs: ['--ansi', '--color', '--trace-warnings'] });

manager.spawn();
manager.on('shardCreate', shard => {
  console.log(`Launched shard ${shard.id}`);
});
