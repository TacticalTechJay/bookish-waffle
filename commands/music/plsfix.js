module.exports = {
    name: 'plsfix',
    description: 'Fixes music. (hopefully)',
    args: false,
    guildOnly: true,
    testing: false,
    cooldown: 30,
    aliases: ['songfix', 'musicfix', 'fix'],
    async execute(message, args, client) {
        const queue = client.queue.get(message.guild.id);
        const player = client.manager.players.get(message.guild.id);
        if (player && !queue) client.manager.leave(message.guild.id);
        if (!player && queue) client.queue.delete(message.guild.id);
        if (player && queue) return message.channel.send('Music seems to be working perfect fine. If you really want to go through with this, reply with `Confirm`').then(async () => {
            try {
                var response = await message.channel.awaitMessages(message2 => message2.content.toLowerCase() == 'confirm' && message2.author.id == message.author.id, {
                    max: 1,
                    time: 10000,
                    errors: ['time']
                });
            } catch(e) {
                if (!e) return await message.channel.send('No response provided.');
            }

            if (response.first().content.toLowercase() == 'confirm') {
                await client.queue.delete(message.guild.id);
                await client.manager.leave(message.guild.id);
                return await message.channel.send('Done.');
            }
        });
        if (!player && !queue) return message.channel.send('This command is not needed. No music is playing and the queue does not exist.');
        return message.channel.send('Done.');
    }
};