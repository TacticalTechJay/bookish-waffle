const Command = require('../../../structures/Command');

module.exports = class notifications extends Command {
    constructor(client) {
        super(client, {
            name: 'notifications',
            description: 'Toggle the now playing notifications.',
            aliases: ['notifs', 'n'],
            category: 'music'
        });
    }

    async exec(message) {
        if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to commit vibe loop.');
        if (!message.guild.player) return message.channel.send('There is no player.');
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You can\'t run that in a channel with no vibe.');
        message.guild.player.settings.notifications = !message.guild.player.settings.notifications;
        return message.channel.send(`Notifications are now ${message.guild.player.settings.notifications ? 'enabled' : 'disabled'}.`);
    }
};