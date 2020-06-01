const Event = require('../structures/Event');

module.exports = class guildDelete extends Event {
    constructor(client) {
        super(client, {
            name: 'guildDelete'
        });
    }

    async exec(guild) {
        if (guild.player) this.client.manager.leave(guild.id);
    }
};