const Command = require('../../../structures/Command');
const { mutate } = require('array-move');

module.exports = class Move extends Command {
    constructor(client) {
        super(client, {
            name: 'move',
            'category': 'music',
            description: 'Move music within the queue.'
        });
    }

    async exec(message, args) {
        let c1 = Number(args[0]);
        let c2 = Number(args[1]);
        --c1;
        --c2;
        if (!message.guild.player) return message.channel.send('There is nothing playing... hmmm :thinking:');
        if (!message.member.voice.channel) return message.channel.send('You need to in a voice channel!');
        else if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You need to be in the same voice channel as me!');
        else if (message.member.voice.selfDeaf) return message.channel.send('You need to be undeafened to use something like this.');
        if (isNaN(c1) || isNaN(c2)) return message.channel.send('You need to put in proper positions to move a song in queue.');
        if (c1 > message.guild.player.songs.length || c1 <= 0) return message.channel.send('That is out of my league!');
        else if (c2 > message.guild.player.songs.length || c2 <= 0) return message.chanenl.send('That is out of my league!');
        else if (c1 == c2) return message.channel.send('That is... the same place? I mean sure I\'ll move it there but, really?');
        mutate(message.guild.player.songs, c1, c2);
        return message.channel.send(`Moved \`${message.guild.player.songs[c1].info.title}\` to postion ${args[1]}`);
    }
};