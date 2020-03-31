module.exports = {
    name: 'ready',
    async exec(client) {
        const { nodes, ADLToken } = require('../config.json');
        const { Manager } = require('@lavacord/discord.js');
        const fetch = require('node-fetch');
        console.log('Ready!');
        client.user.setActivity(`${client.prefix}help for help.`)
            .then(presence => console.log(`Activity is ${presence.activities[0] ? presence.activities[0].name : 'none'}`))
            .catch(console.error);
        client.lavalink = {
            host: nodes[0].host,
            password: nodes[0].password,
            port: nodes[0].port,
            id: nodes[0].id
        };
        client.manager = new Manager(client, nodes, {
            user: client.user.id,
            shards: client.shard.count
        });
        await client.manager.connect();
        setInterval(async () => {
            const body = {
                'users': client.users.cache.size,
                'servers': client.guilds.cache.size,
                'shards': client.shard.count
            };
            try {
                const res = await fetch(`https://abstractlist.net/api/bots/${client.user.id}/stats`, {
                    method: 'post',
                    body: JSON.stringify(body),
                    headers: { 'Content-type': 'application/json', 'Authorization': ADLToken }
                });
                return console.log(await res.json());
            }
            catch (e) {
                return console.error(e);
            }
        }, 1800000);
    }
};
