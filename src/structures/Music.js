const fetch = require('node-fetch');
const { MessageEmbed, Util } = require('discord.js');

class Music {
    constructor(client) {
        this.client = client;
    }
    async getTracks(query) {
        const get = async (query, i) => {
            const res = await fetch(`http://${this.client.util.findNode('eu').host}:${this.client.util.findNode('eu').port}/loadtracks?identifier=${query}`, {
                headers: {
                    Authorization: this.client.util.findNode('eu').password
                }
            });
            const json = await res.json();
            if (i == 3) return { error: 'There were no tracks found...' };
            if (!json) return null;
            else if (json.loadType == 'NO_MATCHES') {
                ++i;
                return get(query, i);
            } else if (json.exception?.severity == 'FAULT') {
                return null;
            }
            return json;
        };
        const json = await get(query, 0);
        if (!json) return { error: 'Looks like there was no response' };
        if (json.tracks?.length < 0 || !json.tracks) return { error: 'There were no tracks found...' };
        return json;
    }

    async tracksPrompt(query, message, search) {
        if (!message.member.voice.channel) return message.channel.send('You are not in a voice channel.')
        let res = await this.getTracks(query);
        if (res.exception || res.error) return message.channel.send(`${res.exception || res.error}`);
        let player = this.client.manager.players.get(message.guild.id);
        if (player && player.loaded && player.loaded.locked && player.loaded.user !== message.author.id) return message.channel.send('This queue is locked, therefore you can\'t modify it.');
        if (!player) {
            player = await this.client.manager.join({
                guild: message.guild.id,
                channel: message.member.voice.channel.id,
                node: 'us'
            }, {
                selfdeaf: true
            });
            player.volume(50);
            this.client.logger.info(`player spawned in ${message.guild.id}`);
        }
        if (player.loaded && player.loaded.locked && player.locked.user !== message.author.user) return message.channel.send('This queue is locked, therefore you can\'t modify it.');
        player.textChannel = message.channel;
        if (!res.tracks[0] || !res.tracks[0].info) return message.channel.send('There were no songs found! :/');
        if (player.playing === false) {
            player.songs = [];
            player.settings = {
                last: -1,
                next: -1,
                loop: 'none',
                notifications: true
            };
            if (search) {
                let i = 0;
                res.tracks.length = 10;
                const em1 = new MessageEmbed()
                    .setTitle('Pick a song!')
                    .setDescription(res.tracks.map(t => `**${++i}** - ${Util.escapeMarkdown(t.info.title)} by ${Util.escapeMarkdown(t.info.author)}`).join('\n'))
                    .setFooter('Say "cancel" to cancel the selection!');
                const m = await message.channel.send(em1);
                try {
                    var prefix = (await message.guild.settings()).prefix;
                    var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content <= 10 && message.author == message2.author || message2.content.toLowerCase().startsWith(`${prefix}play -s`) || message2.content.toLowerCase() == 'cancel', {
                        max: 1,
                        time: 20000,
                        errors: ['time']
                    });
                } catch (e) {
                    if (!e) {
                        m.delete();
                        this.client.manager.leave(player.id);
                        return message.channel.send("No response provided.");
                    }
                }
                if (response.first().content.toLowerCase() == `${prefix.toLowerCase()}play -s`) return;
                else if (response.first().content.toLowerCase() == 'cancel') {
                    m.delete();
                    this.client.manager.leave(player.id);
                    return message.channel.send("Cancelled!");
                }
                const r = response.first().content - 1;
                await this.play(message, res.tracks[r], res);
                player.songs.push(res.tracks[r]);
                ++player.settings.next;
                player.position = player.settings.next;
                if (Math.random() > .3 && !(await message.author.data()).premium.voter) message.channel.send(
                    new MessageEmbed()
                        .setDescription('If you are enjoying Earth-chan, make sure to vote [here](https://top.gg/bot/628802763123589160/vote)')
                );
                return message.channel.send(
                    new MessageEmbed()
                        .setColor(this.client.color)
                        .setTitle('Now Playing')
                        .setThumbnail(`https://img.youtube.com/vi/${res.tracks[r].info.identifier}/maxresdefault.jpg`)
                        .setDescription(`[**${res.tracks[r].info.isStream ? 'Live Stream' : this.client.util.duration(res.tracks[r].info.length, { days: true })}**] [${res.tracks[r].info.title}](${res.tracks[r].info.uri})`)
                );
            } else if (res.playlistInfo.name) {
                await this.play(message, res.tracks[0], res);
                res.tracks.forEach(c => player.songs.push(c));
                ++player.settings.next;
                player.position = player.settings.next;
                return message.channel.send(
                    new MessageEmbed()
                        .setColor(this.client.color)
                        .addField('Loaded Playlist', `${Util.escapeMarkdown(res.playlistInfo.name)}`)
                );
            } else {
                await this.play(message, res.tracks[0], res);
                player.songs.push(res.tracks[0]);
                ++player.settings.next;
                player.position = player.settings.next;
                if (Math.random() > .3) message.channel.send(
                    new MessageEmbed()
                        .setDescription('If you are enjoying Earth-chan, make sure to vote [here](https://top.gg/bot/628802763123589160/vote)')
                );
                return message.channel.send(
                    new MessageEmbed()
                        .setColor(this.client.color)
                        .setTitle('Now Playing')
                        .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].info.identifier}/maxresdefault.jpg`)
                        .setDescription(`[**${res.tracks[0].info.isStream ? 'Live Stream' : this.client.util.duration(res.tracks[0].info.length, { days: true })}**] [${res.tracks[0].info.title}](${res.tracks[0].info.uri})`)
                );
            }
        } else {
            if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You need to be in the same voice channel as me.');
            if (search) {
                let i = 0;
                res.tracks.length = 10;
                const em1 = new MessageEmbed()
                    .setTitle('Pick a song!')
                    .setDescription(res.tracks.map(t => `**${++i}** - ${Util.escapeMarkdown(t.info.title)} by ${Util.escapeMarkdown(t.info.author)}`).join('\n'))
                    .setFooter('Say "cancel" to cancel the selection!');
                const m = await message.channel.send(em1)
                try {
                    var prefix = (await message.guild.settings()).prefix;
                    var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content <= 10 && message.author == message2.author || message2.content.toLowerCase().startsWith(`${prefix}play -s`) || message2.content.toLowerCase() == 'cancel', {
                        max: 1,
                        time: 20000,
                        errors: ['time']
                    });
                } catch (e) {
                    if (!e) {
                        m.delete();
                        return message.channel.send("No response provided.");
                    }
                }
                if (response.first().content.toLowerCase() == `${prefix}play -s`) return;
                else if (response.first().content.toLowerCase() == 'cancel') {
                    m.delete();
                    return message.channel.send("Cancelled!");
                }
                const r = response.first().content - 1;
                player.songs.push(res.tracks[r]);
                if (Math.random() > .3) message.channel.send(
                    new MessageEmbed()
                        .setDescription('If you are enjoying Earth-chan, make sure to vote [here](https://top.gg/bot/628802763123589160/vote)')
                );
                return message.channel.send(
                    new MessageEmbed()
                        .setColor(this.client.color)
                        .setTitle('Now Playing')
                        .setThumbnail(`https://img.youtube.com/vi/${res.tracks[typeof r === "undefined" ? 0 : r].info.identifier}/maxresdefault.jpg`)
                        .setDescription(`[**${res.tracks[r].info.isStream ? 'Live Stream' : this.client.util.duration(res.tracks[r].info.length, { days: true })}**] [${res.tracks[r].info.title}](${res.tracks[r].info.uri})`)
                );
            } else if (res.playlistInfo.name) {
                res.tracks.forEach(c => player.songs.push(c));
                if (Math.random() > .3) message.channel.send(
                    new MessageEmbed()
                        .setDescription('If you are enjoying Earth-chan, make sure to vote [here](https://top.gg/bot/628802763123589160/vote)')
                );    
                return message.channel.send(
                    new MessageEmbed()
                        .setColor(this.client.color)
                        .addField('Loaded Playlist', `${Util.escapeMarkdown(res.playlistInfo.name)}`)
                );
            }
            player.songs.push(res.tracks[0]);
            if (Math.random() > .3) message.channel.send(
                new MessageEmbed()
                    .setDescription('If you are enjoying Earth-chan, make sure to vote [here](https://top.gg/bot/628802763123589160/vote)')
            );
            return message.channel.send(
                new MessageEmbed()
                    .setColor(this.client.color)
                    .setTitle('Added To Queue')
                    .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].info.identifier}/maxresdefault.jpg`)
                    .setDescription(`[**${res.tracks[0].info.isStream ? 'Live Stream' : this.client.util.duration(res.tracks[0].info.length, { days: true })}**] [${res.tracks[0].info.title}](${res.tracks[0].info.uri})`)
            );
        }
    }
    async play(message, track, res) {
        try {
            const player = await this.client.manager.players.get(message.guild.id);
            player.play(track.track);
            player.once('end', async () => {
                if (player.settings.loop === 'none') player.songs.shift();
                if (player.settings.loop === 'queue') {
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
                                .setDescription(`[**${player.songs[player.settings.next].info.isStream ? 'Live Stream' : this.client.util.duration(player.songs[player.settings.next].info.length, { days: true })}**] [${player.songs[player.settings.next].info.title}](${player.songs[player.settings.next].info.uri})`)
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
                                .setDescription(`[**${player.songs[player.settings.next].info.isStream ? 'Live Stream' : this.client.util.duration(player.songs[player.settings.next].info.length, { days: true })}**] [${player.songs[player.settings.next].info.title}](${player.songs[player.settings.next].info.uri})`)
                        );
                    }
                } else if (player.settings.loop === 'single') {
                    await this.play(message, player.songs[player.position]);
                    if (!player.settings.notifications) return;
                    return message.channel.send(
                        new MessageEmbed()
                            .setColor(this.client.color)
                            .setTitle('Now Playing')
                            .setThumbnail(`https://img.youtube.com/vi/${player.songs[player.position].info.identifier}/maxresdefault.jpg`)
                            .setDescription(`[**${player.songs[player.position].info.isStream ? 'Live Stream' : this.client.util.duration(player.songs[player.position].info.length, { days: true })}**] [${player.songs[player.position].info.title}](${player.songs[player.position].info.uri})`)
                    );
                } else if (player.settings.loop === 'none') if (!player.songs.length) return this.finish(message);
                player.songs = player.songs.slice(player.position, player.length)
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
        this.client.logger.info(`Player despawned in ${message.guild.id}`);
        return message.channel.send('Looks like I ran out of songs to vibe to...');
    }
}

module.exports = Music;