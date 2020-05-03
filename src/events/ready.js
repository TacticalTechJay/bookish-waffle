const Event = require('../structures/Event');
const { Manager } = require('@lavacord/discord.js');
const config = require('../../config.json');
const moment = require('moment');

module.exports = class Ready extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        });
    }
    async exec(message) {
        this.client.logger.info(`Started as ${this.client.user.username} at ${moment(this.client.readyAt).format('LLL')}`)
        this.client.manager = new Manager(this.client, config.lavalinkNodes, {
            user: this.client.user.id,
            shards: 0
        });
        await this.client.manager.connect();
        this.client.logger.info(`Initialized lavalink nodes ${config.lavalinkNodes.map(c => c.id).join(', ')}`)
    }
}