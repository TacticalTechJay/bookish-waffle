const Command = require('../../../structures/Command');

module.exports = class Loop extends Command {
    constructor(client) {
        super(client, {
            name: 'loop',
            category: 'music',
            description: 'Loop a queue by either single or queue',
            usage: '[Single/Queue/None]'
        });
    }

    async exec(message, args) {
        if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to commit vibe loop.');
        if (!message.guild.player) return message.channel.send('There is no player.');
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You can\'t run that in a channel with no vibe.');
        if (!args[0]) return message.channel.send('No options provided. Try single, queue, or none.');
        if (args[0].toLowerCase() == 'single') message.guild.player.settings.loop = 'single';
        else if (args[0].toLowerCase() == 'queue') message.guild.player.settings.loop = 'queue';
        else if (args[0].toLowerCase() == 'none') message.guild.player.settings.loop = 'none';
        else return message.channel.send('That was an invalid option. Try single, queue, or none.');
        return message.channel.send(`I have set the loop to ${args[0].toLowerCase()}`);
    }
};