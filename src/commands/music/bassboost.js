const Command = require('../../structures/Command');

module.exports = class Volume extends Command {
    constructor(client) {
        super(client, {
            name: 'bassboost',
            category: 'music',
            aliases: ['bb'],
            description: 'Get some bass, so you can vibe harder.',
            usage: '<max, high, medium, low, none, treble>'
        });
    }

    async exec(message, args) {
        if (!message.member.voice.channel) return message.channel.send('Are you in a voice channel?');
        if (!message.guild.player) return message.channel.send('There is no vibe going on right now!');
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You can\'t run that in a channel with no vibe.');
        if (message.guild.player && message.guild.player.loaded && message.guild.player.loaded.locked && message.guild.player.loaded.user !== message.author.id) return message.channel.send('This queue is locked, therefore you can\'t modify it.');

        const presets = { max: 1, high: 0.25, medium: 0.15, low: 0.05, none: 0, treble: -0.25 };
        if (!args[0]) return message.channel.send(`Please specify a preset: ${Object.keys(presets).join(', ')}`);
        if (!presets[args[0].toLowerCase()] && isNaN(Number(args[0]))) return message.channel.send('Looks like that preset doesn\'t exist!');
        if (Number(args[0]) < -0.25 || Number(args[0]) > 1) return message.channel.send('There would be major problems with this. I won\'t allow that.');
        const bands = [{ band: 0, gain: presets[args[0].toLowerCase()] || Number(args[0]) }, { band: 1, gain: presets[args[0].toLowerCase()] || Number(args[0]) }, { band: 2, gain: presets[args[0].toLowerCase()] || Number(args[0]) }];
        await message.guild.player.equalizer(bands);
        return message.channel.send(`Alright, the bassboost level is now **${args[0].toLowerCase()}**`);
    }
};