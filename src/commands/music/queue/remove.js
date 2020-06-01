const Command = require('../../../structures/Command');

module.exports = class Remove extends Command {
    constructor(client) {
        super(client, {
            name: 'remove',
            category: 'music',
            description: 'Remove a song from the queue.'
        });
    }

    async exec(message, args) {
        if (!args[0]) return message.channel.send('Make a choice as to what song is removed from the queue.');
        if (!message.guild.player) return message.channel.send('There is nothing playing!');
        if (message.guild.player && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You are not in the vc as me.');
        if (args[0].toLowerCase() == 'last') {
            if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use this command!');
            if (!message.guild.me.voice.channel) return message.channel.send('I am not in a voice channel. :thinking:');
            if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You need to be in the same voice channel as me to use this command!');
            if (message.guild.player.songs.length <= 1) return message.channel.send('That ain\'t happening. Add more music then I will consider it.');
            if (message.guild.player.position === message.guild.player.songs.length) return message.channel.send('That ain\'t happening. You are already on that song. Try using skip perhaps.');
            message.guild.player.songs.pop();
            return message.channel.send('Removed the last song of the queue.');
        }
        let toRemove = Number(args[0]);
        --toRemove;
        if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to use this command!');
        if (!message.guild.me.voice.channel) return message.channel.send('I am not in a voice channel. :thinking:');
        if (isNaN(toRemove)) return message.channel.send('That is not a number. :neutral_face:');
        if (message.member.voice.selfDeaf) return message.channel.send('You need to be undeafened to use something like this.');
        if (toRemove <= 0 || toRemove <= message.guild.player.position) return message.channel.send('You can\'t remove that! It could break things!');
        if (toRemove > message.guild.player.songs.length) return message.channel.send('There is no song in that spot.');
        if (message.guild.player.loaded && message.guild.player.loaded.locked && message.guild.player.loaded.user !== message.author.id) return message.channel.send('The queue is locked and loaded and it is aimed at you for interrupting this vibe.');
        message.guild.player.songs.splice(toRemove, 1);
        return message.channel.send('The deed is done.');
    }
};