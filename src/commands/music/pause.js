const Command = require('../../structures/Command');
const { MessageEmbed, Util } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = class Pause extends Command {
    constructor(client) {
        super(client, {
            name: 'pause',
            category: 'music'
        });
    }

    async exec(message, args) {
        if (!message.member.voice.channel) return message.channel.send(`Are you in a voice channel?`)
        if (!message.guild.player) return message.channel.send(`There is no vibe going on right now!`)
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`You can't run that in a channel with no vibe.`);
        if (message.guild.player.paused) return message.channel.send(`You can't pause what has already been paused...`);
        if (message.guild.player && message.guild.player.loaded && message.guild.player.loaded.locked && message.guild.player.loaded.user !== message.author.id) return message.channel.send(`This queue is locked, therefore you can't modify it.`);

        message.guild.player.pause(true);
        return message.channel.send(`I've paused the vibe.`)
    }
}