const Event = require('../structures/Event');
const Server = require('../server');
const { Manager } = require('@lavacord/discord.js');
const config = require('../../config.json');
const moment = require('moment');

module.exports = class Ready extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        });
    }
    async exec() {
        let initalPost = await this.client.statcord.autopost();

        if (initalPost) {
            console.error(initalPost);
            process.exit();
        }
        this.client.logger.info(`started as ${this.client.user.username} at ${moment(this.client.readyAt).format('LLL')}`);
        this.client.manager = new Manager(this.client, config.lavalinkNodes, {
            user: this.client.user.id,
            shards: 0
        });
        await this.client.manager.connect();
        this.client.logger.info(`initialized lavalink nodes ${config.lavalinkNodes.map(c => c.id).join(', ')}`);
        this.client.interval = setInterval(() => {
            this.client.user.setActivity(`people type "${process.env.DEVELOPMENT ? config.prefixes.dev : config.prefixes.prod}help" in ${this.client.guilds.cache.size} servers.`, { type: 'WATCHING' });
        }, 30000);
        new Server(this.client, process.env.DEVELOPMENT ? config.port.dev : config.port.prod, () => {
            this.client.logger.info(`initialized api ${process.env.DEVELOPMENT ? config.port.dev : config.port.prod}`);
        });
    }
};