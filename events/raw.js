module.exports = {
    name: 'raw',
    async exec(packet, a, client) {
        if (!['GUILD_CREATE', 'GUILD_DELETE', 'VOICE_STATE_UPDATE'].includes(packet.t)) return;
        const { MessageEmbed } = require('discord.js');
        if (packet.t == 'GUILD_CREATE') {
            if (packet.d.unavailable || packet.d.lazy) return;
            const embed = new MessageEmbed()
                .setTitle('Guild added.')
                .addField('Guild Name', packet.d.name)
                .addField('Guild ID', packet.d.id)
                .addField('Guild Owner', client.users.cache.get(packet.d.owner_id).tag)
                .addField('Guild Members', packet.d.member_count)
                .setColor('GREEN');
            return client.channels.cache.get('661669168009052200').send(embed);
        }
        else if (packet.t == 'GUILD_DELETE') {
            if (packet.d.unavailable || packet.d.lazy) return;
            const embed = new MessageEmbed()
                .setTitle('Guild removed.')
                .addField('Guild Name', packet.d.name)
                .addField('Guild ID', packet.d.id)
                .addField('Guild Owner', client.users.cache.get(packet.d.owner_id).tag)
                .addField('Guild Members', packet.d.member_count)
                .setColor('RED');
            return client.channels.cache.get('661669168009052200').send(embed);
        }
        else if (packet.t == 'VOICE_STATE_UPDATE') {
            if (packet.d.user_id !== client.user.id) return;
            if (!packet.d.channel_id) {
                if (!packet.d.guild_id || packet.d.self_deaf) return;
                await client.queue.delete(packet.d.guild_id);
                await client.manager.leave(packet.d.guild_id);
                return !client.manager.players.get(packet.d.guild_id);
            }
        }
    }
};
