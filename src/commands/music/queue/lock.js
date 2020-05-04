const Command = require('../../../structures/Command');
const { MessageEmbed, Util } = require('discord.js');

module.exports = class SaveQueue extends Command {
    constructor(client) {
        super(client, {
            name: 'lock',
            category: 'music',
            description: `Lock a queue so prople don't try to ruin your vibe!`
        });
    }

    async exec(message, args) {
        if (!message.member.voice.channel) return message.channel.send(`Are you in a voice channel?`)
        if (!message.guild.player) return message.channel.send(`There is no vibe going on right now!`)
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`You can't run that in a channel with no vibe.`);
        if (!message.guild.player.loaded) return message.channel.send(`Looks like this queue isn't loaded, so we can't lock it!`);
        if (message.author.id !== message.guild.player.loaded.user) return message.channel.send(`**${this.client.users.cache.get(message.guild.player.loaded.user).tag}** owns this queue, so you can't lock it!`);
        message.guild.player.loaded.locked = !message.guild.player.loaded.locked;
        return message.channel.send(`The queue lock has been ${message.guild.player.loaded.locked ? 'locked' : 'unlocked'} by **${message.author.tag}** for queue **${message.guild.player.loaded.name}**`)
    }
}