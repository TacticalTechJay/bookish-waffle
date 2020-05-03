const Command = require('../../../structures/Command');
const { MessageEmbed, Util } = require('discord.js');
const config = require('../../../../config.json');

module.exports = class LoadQueue extends Command {
    constructor(client) {
        super(client, {
            name: 'loadqueue',
            aliases: ['lq', 'loadq', 'queueload'],
            category: 'music',
            devOnly: true
        });
    }

    async exec(message, args) {
        if (!args[0]) return message.channel.send(`You didn't supply any arguments...`)
        const user = await this.client.util.user('485725864722563072');
        if (!user.queues[args.join(' ')]) return message.channel.send(`Looks like that queue isnt saved...`);
        let player = this.client.manager.players.get(message.guild.id);
        if (player) return message.channel.send(`The queue must be **empty** before loading a queue`);
        await this.client.manager.join({
            guild: message.guild.id,
            channel: message.member.voice.channel.id,
            node: config.lavalinkNodes[0].id
        }, { selfdeaf: true });
        player = this.client.manager.players.get(message.guild.id);
        player.volume(50);
        player.textChannel = message.channel;
        if (player.playing === false) {
            player.songs = [];
            player.settings = {
                last: -1,
                next: -1,
                loop: "none",
                notifications: true
            };
            player.loaded = {
                name: args.join(' '),
                user: `485725864722563072`,
                locked: false
            }
            for (let i of user.queues[args.join(' ')]) {
                player.songs.push(i);
            }
            await this.client.util.music.play(message, player.songs[0]);
            ++player.settings.next;
            player.np = player.settings.next;
            return message.channel.send(`I've loaded **${user.queues[args.join(' ')].length}** tracks from ${Util.escapeMarkdown(args.join(' '))}`);
        } else {
            return message.channel.send(`The queue must be **empty** before loading a queue`);
        }
    }
}