const Event = require('../structures/Event');

module.exports = class voiceStateUpdate extends Event {
    constructor(client) {
        super(client, {
            name: 'voiceStateUpdate'
        });
    }

    async exec(oldState, newState) {
        if (oldState.member.user.id !== this.client.user.id) return;

        const player = this.client.manager.players.get(oldState.guild.id);

        if (!player) return;
        if (!player.playing) return;

        if (oldState.channel && !newState.channel) return await this.client.manager.leave(oldState.guild.id);
    }
};