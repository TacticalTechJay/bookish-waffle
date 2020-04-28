module.exports = {
    name: 'ready',
    async exec(client) {
        const { stable, beta, sys } = require('../config.json');
        const { Manager } = require('@lavacord/discord.js');
        const fetch = require('node-fetch');
        const ADLToken = Number(process.env.MODE) ? stable.ADLToken : beta.ADLTOKEN;
        console.log('Ready!');
        client.user.setActivity(`${client.prefix}help for help.`)
            .then(presence => console.log(`Activity is ${presence.activities[0] ? presence.activities[0].name : 'none'}`))
            .catch(console.error);
        client.lavalink = {
            host: sys.nodes[0].host,
            password: sys.nodes[0].password,
            port: sys.nodes[0].port,
            id: sys.nodes[0].id
        };
        client.manager = new Manager(client, sys.nodes, {
            user: client.user.id,
            shards: client.shard.count
        });
        await client.manager.connect();
        client.utils.orm(client);
        var interval = setInterval(async () => {
            const body = {
                'users': client.users.cache.size,
                'servers': client.guilds.cache.size,
                'shards': client.shard.count
            };
            if (!ADLToken) {
                clearInterval(interval);
                throw 'No token was provided for ADL.';
            }
            const res = await fetch(`https://abstractlist.net/api/bots/${client.user.id}/stats`, {
                method: 'post',
                body: JSON.stringify(body),
                headers: { 'Content-type': 'application/json', 'Authorization': ADLToken }
            });
            return console.log(await res.json());
        }, 1800000);
    }
};
