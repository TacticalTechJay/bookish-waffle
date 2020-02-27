module.exports = {
    name: 'bassboost',
    description: 'Set a level of bassboost based on four different levels.',
    category: 'music',
    guildOnly: true,
    args: true,
    testing: false,
    donatorOnly: true,
    voterOnly: true,
    aliases: ['bb', 'boost'],
    usage: '<high/medium/low/none>',
    async execute(message, args, client) {
        const player = await client.manager.get(message.guild.id);
        const queue = await client.queue.get(message.guild.id);
        if (!player || !queue) return message.channel.send('There are no songs in the queue. How would I bassboost what\'s playing if it is `null`? 🤔');
        if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use this command!');
        if (!message.guild.me.voice.channel) return message.channel.send('I am not in a voice channel. :thinking:');
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You need to be in the same voice channel as me to use this command!');
        function node(band, gain) {
            return { band, gain };
        }
        const presets = { highaf: 1.5, high: 0.25, medium: 0.15, low: 0.05, none: -0.10 };
        if (args[0].toLowerCase() == 'highaf' || args[0].toLowerCase() == 'high' || args[0].toLowerCase() == 'medium' || args[0].toLowerCase() == 'low' || args[0].toLowerCase() == 'none') {
            const bands = [node(0, presets[args[0].toLowerCase()]), node(1, presets[args[0].toLowerCase()]), node(2, presets[args[0].toLowerCase()])];
            message.channel.send('Set bassboost level to `' + args[0].toLowerCase() + '`.');
            return player.node.send({ op: 'equalizer', guildId: message.guild.id, bands });
        }
        else {
            return message.channel.send('Use either `high`, `medium`, `low`, or `none` to change the levels. ');
        }
    }
};
/*
    bassboost(level, player) {
        let node = (band, gain) => { band, gain };
        const presets = { high: 0.25, medium: 0.15, low: 0.05, none: 0.00 };
        if (typeof (level) == "string") {
            let bands = [ node(0, presets[level]), node(1, presets[level]), node(2, presets[level]) ];
            this.basslevel = level;
            return player.node.send("equalizer", { bands });
        } else return false;
    }
*/
