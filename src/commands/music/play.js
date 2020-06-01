const Command = require('../../structures/Command');

module.exports = class Play extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            aliases: ['p'],
            category: 'music',
            description: 'Play a song from various sources!',
            usage: '[Query]'
        });
    }

    async exec(message, args) {
        if (message.guild.player && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You are not in the vc as me.');
        if (!message.guild.player)
            if (!args[0]) return message.channel.send('No query provided.');
        if (!args[0]) return message.channel.send('No query provided.');
        if (message.flags.S || message.flags.s) {
            if (args.join(' ').startsWith('http')) return message.channel.send('You can\'t search URLs.');
            return await this.client.util.music.tracksPrompt(`ytsearch:${encodeURIComponent(args.join(' '))}`, message, true);
        }
        if (args.join(' ').startsWith('http')) await this.client.util.music.tracksPrompt(args.join(' '), message, false);
        else await this.client.util.music.tracksPrompt(`ytsearch:${encodeURIComponent(args.join(' '))}`, message, false);
    }
};