const Command = require('../../structures/Command');
const { MessageEmbed, Util } = require('discord.js');

module.exports = class Stop extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            category: 'music'
        });
    }

    async exec(message, args) {
        if (!message.member.voice.channel) return message.channel.send(`Are you in a voice channel?`)
        if (!message.guild.player) return message.channel.send(`There is no vibe going on right now!`)
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`You can't run that in a channel with no vibe.`);

        this.client.manager.leave(message.guild.id);
        return message.channel.send(`I've stopped the vibe.`)
    }
}