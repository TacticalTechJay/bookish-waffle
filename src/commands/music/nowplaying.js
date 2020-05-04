const Command = require('../../structures/Command');
const { MessageEmbed, Util } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = class NowPlaying extends Command {
    constructor(client) {
        super(client, {
            name: 'nowplaying',
            aliases: ['np'],
            category: 'music',
            description: `View the song that is currently playing`
        });
    }

    async exec(message, args) {
        if (!message.guild.player) return message.channel.send(`There is no vibe going on right now!`)
        const player = message.guild.player;
        const song = player.songs[player.position];
        const timeDisplay = `${this.client.util.duration(player.state.position)}/${this.client.util.duration(song.info.length)}`;
        const timeBar = "━".repeat(20).split("");
        for (let i = 0; i < timeBar.length; i++) {
            if (i === timeBar.length - 1 || i === Math.round((20 * player.state.position) / song.info.length)) {
                timeBar.splice(i, 1, "⚪");
                break;
            }
        }
        const embed = new MessageEmbed()
            .setColor(this.client.color)
            .setTitle(`Now Playing in ${message.guild.me.voice.channel.name}`)
            .setDescription(`
[**Title**] [${song.info.title}](${song.info.uri})
[**Loop**] \`${player.settings.loop.toProperCase()}\`
[**Volume**] \`${player.state.volume}\`
[**Notifications**] \`${player.settings.notifications ? 'Enabled' : 'Disabled'}\`
[**Time**] \`${song.info.isStream ? `Can't show timestamps for a Live Stream` : `${timeDisplay} ${timeBar.join("")}`}\`
`)
        return message.channel.send(embed);
    }
}