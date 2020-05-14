const Command = require('../../structures/Command');

module.exports = class Volume extends Command {
    constructor(client) {
        super(client, {
            name: 'bassboost',
            category: 'music',
            aliases: ['bb'],
            description: 'Get some bass, so you can vibe harder.',
            usage: '[Level = highaf, high, medium, low, none]'
        });
    }

    async exec(message, args) {
        if (!message.member.voice.channel) return message.channel.send('Are you in a voice channel?');
        if (!message.guild.player) return message.channel.send('There is no vibe going on right now!');
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You can\'t run that in a channel with no vibe.');
        if (message.guild.player && message.guild.player.loaded && message.guild.player.loaded.locked && message.guild.player.loaded.user !== message.author.id) return message.channel.send('This queue is locked, therefore you can\'t modify it.');

        const presets = { highaf: 1.5, high: 0.25, medium: 0.15, low: 0.05, none: -0.10 };
        if (!args[0]) return message.channel.send(`Please specify a preset: ${Object.keys(presets).join(', ')}`);
        if (!presets[args[0].toLowerCase()]) return message.channel.send('Looks like that prefix doesn\'t exist!');
        const bands = [{ band: 0, presets: presets[args[0].toLowerCase()] }, { band: 1, presets: presets[args[0].toLowerCase()] }, { band: 2, presets: presets[args[0].toLowerCase()] }];
        await message.guild.player.node.send({ op: 'equalizer', guildId: message.guild.id, bands });
        return message.channel.send(`Alright, the bassboost level is now **${args[0].toLowerCase()}**`);
    }
};