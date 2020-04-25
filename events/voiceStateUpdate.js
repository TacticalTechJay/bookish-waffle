module.exports = {
    name: 'voiceStateUpdate',
    async exec(oldState, newState, client) {
        if (oldState.member.user.id !== client.user.id) return;
        if (!oldState.channel) return;
        if (!newState.channel) {
            await client.queue.delete(newState.guild.id);
            await client.manager.leave(newState.guild.id);
            return !client.manager.players.get(newState.guild.id);
        }
    }
};