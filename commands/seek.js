module.exports = {
    name: 'seek',
    description: 'Fastforward or rewind a song.',
    category: 'music',
    args: true,
    guildOnly: true,
    usage: '<Forward/Backwards> <Amount>',
    async execute(message, args, client) {
        const player = client.manager.get(message.guild.id);
        const queue = client.queue.get(message.guild.id);
        if (!player || !queue) return message.channel.send('You need to be playing music to use this command');
	if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel.');
        if (message.member.voice.channel !== message.guild.me.voice.channel) return message.channel.send('You need to be in the same voice channel as me!');
        if (!args[0]) return message.channel.send('You need to specify on whether you are going to seek forwards or backwards!');
        if (args[0].toLowerCase() == 'forwards' || args[0].toLowerCase() == 'forward') {
            args.shift();
            const amount = player.state.position + require('ms')(args.join(' '));
            const test = require('ms')(args.join(' '));
            if (typeof test !== 'number') return message.channel.send('Improper format of amount!\nIt should be like this: `plana seek forward 1m 24s`');
            if (amount > queue.songs[0].info.length) return message.channel.send('That is too far!');
            player.seek(amount);
            return message.channel.send(`Going forward with specified amount: ${args.join(' ')}`);
        }
 else if (args[0].toLowerCase() == 'backwards' || args[0].toLowerCase() == 'backward' || args[0].toLowerCase() == 'rewind') {
            args.shift();
            const amount = player.state.position - require('ms')(args.join(' '));
            const test = require('ms')(args.join(' '));
            if (typeof test !== 'number') return message.channel.send('Improper format of amount!\nIt should be like this: `plana seek backward 1m 24s`');
            if (amount < 0) return message.channel.send('That is too far!');
            player.seek(amount);
            return message.channel.send(`Going backwards with specified amount: ${args.join(' ')}`);
        }
        const amount = require('ms')(args.join(' '));
        if (typeof amount !== 'number') return message.channel.send('Your specified amount was invalid. Try this:\n`plana seek 1m 30s`');
	if (amount <= -1 || amount >= ++queue.songs[0].info.length) return message.channel.send('Your specified point was out of reach! Try going within the limits');
        player.seek(amount);
        return message.channel.send(`I have went to point ${args.join(' ')}`);
    }
};
