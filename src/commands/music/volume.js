const Command = require('../../structures/Command');
const { MessageEmbed, Util } = require('discord.js');

module.exports = class Volume extends Command {
    constructor(client) {
        super(client, {
            name: 'volume',
            category: 'music',
            aliases: ['vol']
        });
    }

    async exec(message, args) {
        if (!message.member.voice.channel) return message.channel.send(`Are you in a voice channel?`)
        if (!message.guild.player) return message.channel.send(`There is no vibe going on right now!`)
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`You can't run that in a channel with no vibe.`);
        if (message.guild.player && message.guild.player.loaded && message.guild.player.loaded.locked && message.guild.player.loaded.user !== message.author.id) return message.channel.send(`This queue is locked, therefore you can't modify it.`);
        if (!args[0]) return message.channel.send(`The current volume seems to be **${message.guild.player.state.volume}**%`)
        const vol = Number(args[0]);
        if (isNaN(vol)) return message.channel.send(`That should have been a number..`)
        if (vol > 150) return message.channel.send(`Are you sure that you want to kill your ears...`);
        if (vol < 10) return message.channel.send(`You can just stop playing music, if you don't want to hear it.`);
        if (vol === message.guild.player.state.volume) return message.channel.send(`There is no need to run this command if you are going to set it to the same volume.`);
        message.guild.player.volume(vol);
        return message.channel.send(`The volume has been ${message.guild.player.state.volume > vol ? 'decreased' : 'increased'} to **${vol}**%!`)
    }
}