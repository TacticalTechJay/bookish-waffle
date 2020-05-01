const { Command } = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class Play extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            aliases: ['p']
        });
    }

    async exec(message, args) {
        if (message.guild.player && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`no`);
        if (!message.guild.player)
            if (!args[0]) return message.channel.send(`no`);
        if (!args[0]) return message.channel.send(`no`);
        if (args.join(' ').startsWith("http")) await this.client.util.music.tracksPrompt(args.join(' '), message);
        else await this.client.util.music.tracksPrompt(`ytsearch:${args.join(' ')}`, message);
    }
}