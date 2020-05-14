const Command = require('../../../structures/Command');
const { Util } = require('discord.js');

module.exports = class SaveQueue extends Command {
    constructor(client) {
        super(client, {
            name: 'savequeue',
            aliases: ['sq', 'saveq', 'queuesave', 'qs'],
            category: 'music',
            description: 'Save the the songs in the queue so that you can easily load them back and enjoy.',
            usage: '[Name]'
        });
    }

    async exec(message, args) {
        if (!message.member.voice.channel) return message.channel.send('Are you in a voice channel?');
        if (!message.guild.player) return message.channel.send('There is no vibe going on right now!');
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You can\'t run that in a channel with no vibe.');
        const user = await this.client.util.user(message.author.id);
        if (!args[0]) return message.channel.send('You didn\'t supply any arguments...');
        if (user.queues[args.join(' ')]) return message.channel.send('Looks like there is already a saved queue with that name!');
        if (message.guild.player.songs.length === 1) return message.channel.send('There\'s only 1 song in your queue...');
        user.queues[args.join(' ')] = message.guild.player.songs;
        this.client.orm.repos.user.save(user);
        return message.channel.send(`Alright, I've saved **${message.guild.player.songs.length}** songs to ${Util.escapeMarkdown(args.join(' '))}`);
    }
};