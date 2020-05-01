const { Command } = require('../../structures/Command');
const { MessageEmbed, Util } = require('discord.js');

module.exports = class Skip extends Command {
    constructor(client) {
        super(client, {
            name: 'skip'
        });
    }

    async exec(message, args) {
        if (!message.member.voice.channel) return message.channel.send(`Are you in a Voice Channel?`)
        if (!message.guild.player) return message.channel.send(`There is no vibe going on right now!`)
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`You can't run that in a channel with no vibe.`);
        player.stop();
        return message.channel.send(`I've skipped the song that you were vibing to.`)
    }
}