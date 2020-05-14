const Command = require('../../../structures/Command');
const { MessageEmbed, Util } = require('discord.js');

module.exports = class Queue extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            aliases: ['q'],
            category: 'music',
            description: `View all songs that are playing right now!`,
            usage: '[Page?]'
        });
    }

    async exec(message, args) {
        if (!message.guild.player) return message.channel.send(`There is no vibe going on right now!`)
        if (message.guild.player.settings.loop !== "none") {
            const player = message.guild.player;
            let page = parseInt(args[0] ? parseInt(args[0]) : (player.position / 10 | 0) + 1);
            let i = 0;
            const embed = new MessageEmbed()
                .setColor(this.client.color)
                .setTitle(`(${player.songs.length}) Queue${player.loaded ? ` - (${player.loaded.name})` : ''}`)
                .setDescription(`${player.loaded ? `${player.loaded.locked ? `**Queue is locked by ${this.client.users.cache.get(player.loaded.user).tag}**` : ''}` : 'b'}**Volume:** ${player.state.volume}% | **Loop:** ${player.settings.loop}\n${player.songs.slice(((page - 1) * 10) || 0, (page * 10) || 0).map(c => `**${player.songs.findIndex(b => b === c) + 1}.** ${player.position === player.songs.findIndex(b => b === c) ? `**[${Util.escapeMarkdown(c ? c.info.title : 'Error')}](${c ? c.info.uri : 'Error'})**` : `[${Util.escapeMarkdown(c ? c.info.title : 'Error')}](${c ? c.info.uri : 'Error'})`}`).join('\n')}`)
                .setFooter(`Currently page ${page}`);
            return message.channel.send(embed);
        } else {
            const player = message.guild.player;
            let page = parseInt(args[0] ? parseInt(args[0]) : (player.position / 10 | 0) + 1);
            let i = 0;
            const embed = new MessageEmbed()
                .setColor(this.client.color)
                .setTitle(`(${player.songs.length}) Queue${player.loaded ? ` - (${player.loaded.name})` : ''}`)
                .setDescription(`${player.loaded ? `${player.loaded.locked ? `**Queue is locked by ${this.client.users.cache.get(player.loaded.user).tag}**\n` : ''}` : ''}**Volume:** ${player.state.volume}% | **Loop:** ${player.settings.loop}\n${player.songs.slice(((page - 1) * 10) || 0, (page * 10) || 0).map(c => `**${player.songs.findIndex(b => b === c) + 1}.** [${Util.escapeMarkdown(c ? c.info.title : 'Error')}](${c ? c.info.uri : 'Error'})`).join('\n')}`)
                .setFooter(`Currently page ${page}`);
            return message.channel.send(embed);
        }
    }
}