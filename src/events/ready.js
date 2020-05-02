const Event = require('../structures/Event');
const { Manager } = require('@lavacord/discord.js');
const config = require('../../config.json');

module.exports = class Ready extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        });
    }
    async exec(message) {
        console.log('hi');
        this.client.manager = new Manager(this.client, config.lavalinkNodes, {
            user: this.client.user.id,
            shards: 0
        });
        await this.client.manager.connect();
    }
}