const fetch = require('node-fetch');
const config = require('../../config.json');
const { MessageEmbed, Util } = require('discord.js')

class Music {
    constructor(client) {
        this.client = client;
    }
    async getTracks(query) {
        const res = await fetch(
            `http://${config.lavalinkNodes[0].host}:${
            config.lavalinkNodes[0].port
            }/loadtracks?identifier=${query}`,
            {
                headers: {
                    Authorization: config.lavalinkNodes[0].password
                }
            }
        );
        const json = await res.json();
        if (!json) return { error: "No response." };
        if (json.tracks.length < 0) return { error: "No tracks." };
        return json;
    }
    async tracksPrompt(query, message) {
        const res = await this.getTracks(query);
        if (res.error || res.exception) return message.channel.send(`${res.error || res.exception}`);
        let player = this.client.manager.players.get(message.guild.id);
        if (!player) {
            player = await this.client.manager.join({
                guild: message.guild.id,
                channel: message.member.voice.channel.id,
                node: config.lavalinkNodes[0].id
            }, {
                selfdeaf: true
            });
            player.volume(50);
        }
        player.textChannel = message.channel;
        // if (!res.tracks[0] || !res.tracks[0].info) ret/urn message.channel.send(`I coulnd't find any songs!`);
        if (player.playing === false) {
            player.songs = [];
            player.settings = {
                last: -1,
                next: -1,
                loop: "none",
                notifications: true
            };
            if (res.playlistInfo.name) {
                await this.play(message, res.tracks[0]);
                res.tracks.forEach(c => player.songs.push(c));
                ++player.settings.next;
                player.position = player.settings.next;
                return message.channel.send(
                    new MessageEmbed()
                        .setColor(this.client.color)
                        .addField("Loaded Playlist", `${Util.escapeMarkdown(res.playlistInfo.name)}`)
                );
            }
            await this.play(message, res.tracks[0]);
            player.songs.push(res.tracks[0]);
            ++player.settings.next;
            player.position = player.settings.next;
            return message.channel.send(
                new MessageEmbed()
                    .setColor(this.client.color)
                    .setTitle('Now Playing')
                    .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].info.identifier}/maxresdefault.jpg`)
                    .setDescription(`[**${this.client.util.duration(res.tracks[0].info.length, { days: true })}**] [${res.tracks[0].info.title}](${res.tracks[0].info.uri})`)
            );
        } else {
            player.songs.push(res.tracks[0]);
            return message.channel.send(
                new MessageEmbed()
                    .setColor(this.client.color)
                    .setTitle('Added To Queue')
                    .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].info.identifier}/maxresdefault.jpg`)
                    .setDescription(`[**${this.client.util.duration(res.tracks[0].info.length, { days: true })}**] [${res.tracks[0].info.title}](${res.tracks[0].info.uri})`)
            );
        }
    }
    async play(message, track) {
        try {
            const player = await this.client.manager.players.get(message.guild.id);
            player.play(track.track);
            player.once("end", async () => {
                if (player.settings.loop === "none") player.songs.shift();
                if (player.settings.loop === "queue") {
                    ++player.settings.next;
                    ++player.settings.last;
                    if (player.settings.next > player.songs.length - 1) {
                        player.settings.next = -1;
                        player.settings.last = -1;
                        ++player.settings.next;
                        player.position = player.settings.next;
                        await this.play(
                            message,
                            player.songs[player.settings.next]
                        );
                        if (!player.settings.notifications) return;
                        return message.channel.send(
                            new MessageEmbed()
                                .setColor(this.client.color)
                                .setTitle('Now Playing')
                                .setThumbnail(`https://img.youtube.com/vi/${player.songs[player.settings.next].info.identifier}/maxresdefault.jpg`)
                                .setDescription(`[**${this.client.util.duration(player.songs[player.settings.next].info.length, { days: true })}**] [${player.songs[player.settings.next].info.title}](${player.songs[player.settings.next].info.uri})`)
                        );
                    } else if (!(player.settings.next > player.songs.length - 1)) {
                        player.position = player.settings.next;
                        await this.play(message, player.songs[player.settings.next]);
                        if (!player.settings.notifications) return;
                        return message.channel.send(
                            new MessageEmbed()
                                .setColor(this.client.color)
                                .setTitle('Now Playing')
                                .setThumbnail(`https://img.youtube.com/vi/${player.songs[player.settings.next].info.identifier}/maxresdefault.jpg`)
                                .setDescription(`[**${this.client.util.duration(player.songs[player.settings.next].info.length, { days: true })}**] [${player.songs[player.settings.next].info.title}](${player.songs[player.settings.next].info.uri})`)
                        );
                    }
                } else if (player.settings.loop === "single") {
                    player.settings.voteSkips = [];
                    player.position = 0;
                    await this.play(message, player.songs[0]);
                    if (!player.settings.notifications) return;
                    return message.channel.send(
                        new MessageEmbed()
                            .setColor(this.client.color)
                            .setTitle('Now Playing')
                            .setThumbnail(`https://img.youtube.com/vi/${player.songs[0].info.identifier}/maxresdefault.jpg`)
                            .setDescription(`[**${this.client.util.duration(player.songs[0].info.length, { days: true })}**] [${player.songs[0].info.title}](${player.songs[0].info.uri})`)
                    );
                } else if (player.settings.loop === "none") if (!player.songs.length) return this.finish(message);
                player.position = 0;
                await this.play(message, player.songs[0]);
                if (!player.settings.notifications) return;
                return message.channel.send(
                    new MessageEmbed()
                        .setColor(this.client.color)
                        .setTitle('Now Playing')
                        .setThumbnail(`https://img.youtube.com/vi/${player.songs[0].info.identifier}/maxresdefault.jpg`)
                        .setDescription(`[**${this.client.util.duration(player.songs[0].info.length, { days: true })}**] [${player.songs[0].info.title}](${player.songs[0].info.uri})`)
                );
            });
        } catch (err) {
            console.log(err);
        }
    }
    async finish(message) {
        this.client.manager.leave(message.guild.id);
        return message.channel.send(`Looks like I ran out of songs to vibe to...`);
    }
}

module.exports = Music;