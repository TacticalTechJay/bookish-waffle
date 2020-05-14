const Command = require('../../structures/Command');

module.exports = class Stop extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            category: 'music',
            description: 'Stop the song that is currently playing, which will make me leave the voice channel also!'
        });
    }

    async exec(message) {
        if (!message.member.voice.channel) return message.channel.send('Are you in a voice channel?');
        if (!message.guild.player) return message.channel.send('There is no vibe going on right now!');
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You can\'t run that in a channel with no vibe.');
        if (message.guild.player && message.guild.player.loaded && message.guild.player.loaded.locked && message.guild.player.loaded.user !== message.author.id) return message.channel.send('This queue is locked, therefore you can\'t modify it.');

        this.client.manager.leave(message.guild.id);
        return message.channel.send('I\'ve stopped the vibe.');
    }
};