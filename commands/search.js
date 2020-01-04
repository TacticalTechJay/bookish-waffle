module.exports = {
	name: 'search',
    description: 'Search for music to play! Great ikr?',
    category: 'music',
	guildOnly: true,
	testing: false,
	cooldown: 10,
    args: true,
    usage: '<SearchTerm>',
	async execute(message, args, client) {
        const { MessageEmbed, Util } = require('discord.js');
	let a = null;
        if (!message.member.voice.channel) return message.channel.send('You must be in a voice channel!');
        if (message.guild.me.voice.channel) {
            if (message.guild.me.voice.channel.id !== message.member.voice.channel.id) return message.channel.send('No.')
        }
	if (!message.guild.me.hasPermission(['CONNECT', 'SPEAK', 'VIEW_CHANNEL'])) return message.channel.send('I do not have the required permissions to play music');
	if (!message.member.voice.channel.permissionsFor(message.guild.me).has(['SPEAK', 'CONNECT', 'VIEW_CHANNEL'])) return message.channel.send('I do not have the required permissions to play music');
        const player = await client.manager.get(message.guild.id);
        if (!player) {
            if (!client.queue.get(message.guild.id)) createQueue(client, message.guild.id);
            if (client.queue.get(message.guild.id)) {
                if (!args.join(' ')) return play(client, message);
            }
        }
        if (args.join(' ').startsWith('http')) {
            return message.channel.send('I can not search links!')
        }
        else {
            getSong(`ytsearch:${encodeURIComponent(args.join(' '))}`, message, message.client);
        }
        async function getSongs(string, client) {
            const fetch = require('node-fetch');
            const res = await fetch(`http://${client.lavalink.host}:${client.lavalink.port}/loadtracks?identifier=${string}`, {
                headers: { 'Authorization': client.lavalink.password }
            }).catch(err => {
                console.error(err)
                return null;
            });
            const res2 = await res.json()
            if (!res2) throw 'NO RESPONSE';
            if (!res2.tracks) throw 'NO TRACKS';
            return res2;
        }
        async function createQueue(client, guild) {
            client.queue.set(guild, {
                songs: [],
                looping: false
            });
		}
	async function askWhich(song, message) {
            let i = 0;
            song.tracks.length = 10;
			let em1 = new MessageEmbed()
				.setTitle("Pick a song!")
                        .setDescription(song.tracks.map(t => `**${++i}** - ${Util.escapeMarkdown(t.info.title)} by ${Util.escapeMarkdown(t.info.author)}`).join('\n'))
                        .setFooter('Say "cancel" to cancel the selection!');
            message.channel.send(em1).then(m => a = m);
            return await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 10 && message.author == message2.author || message2.content.toLowerCase().startsWith('plana search') || message2.content.toLowerCase() == 'cancel', {
                max: 1,
                time: 15000,
                errors: ['time']
            })
		}
        async function getSong(string, message, client) {
            getSongs(string, client).then(async song => {
                if (!song) return message.channel.send('No tracks were found');
                if (!client.queue.get(message.guild.id)) createQueue(client, message.guild.id);

                if (!client.manager.get(message.guild.id)) await join(client, message);
                let player = client.manager.get(message.guild.id);
                if (player.playing === false) {
                    askWhich(song, message).then(async response => {
			            if (response.first().content.toLowerCase() == 'plana search') return;
                        if (response.first().content.toLowerCase() == 'cancel') {
                        	message.channel.messages.fetch(a.id).then(m => m.delete());
				            client.queue.delete(message.guild.id);
				            client.manager.leave(message.guild.id);
                        	return message.channel.send('Cancelled. Gone. Reduced to atoms.')
                        }
                        const r = response.first().content - 1;
                        play(client, message, song.tracks[r].track);
                        const thu = song.tracks[r].info.identifier;
                        message.channel.messages.fetch(a.id).then(m => m.delete());
                        song.tracks[r].requester = message.author;
                        client.queue.get(message.guild.id).songs.push(song.tracks[r]);
                        const em = new MessageEmbed()
                            .setTitle('Now Playing:')
                            .setColor(0x2daa4b)
                            .setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
                            .setDescription(`
                Title: [${song.tracks[r].info.title}](${song.tracks[r].info.uri})\nAuthor: ${song.tracks[r].info.author}
                `);
                        message.channel.send(em);
                    });
                }
                else {
                    askWhich(song, message).then(async response => {
			            if (response.first().content.toLowerCase() == 'plana search') return;
                        if (response.first().content.toLowerCase() == 'cancel') {
                        	message.channel.messages.fetch(a.id).then(m => m.delete());
                        	return message.channel.send('Cancelled. Gone. Reduced to atoms.')
                        }
                        let r = response.first().content - 1;
                        let thu = song.tracks[r].info.identifier;
                        message.channel.messages.fetch(a.id).then(m => m.delete());
                        song.tracks[response.first().content - 1].requester = message.author;
                        client.queue.get(message.guild.id).songs.push(song.tracks[response.first().content - 1]);
                        let em = new MessageEmbed()
                            .setTitle('Added To Queue:')
                            .setColor(0x2697ff)
                            .setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
                            .setDescription(`
                Title: [${song.tracks[response.first().content - 1].info.title}](${song.tracks[response.first().content - 1].info.uri})\nAuthor: ${song.tracks[response.first().content - 1].info.author}
                `);
                        message.channel.send(em);    
                    })
                }
            }).catch(err => {
                console.log(err);
                return message.channel.send('There was an error. ' + err);
            });
        }
        async function play(client, message, track) {
            try {
                const queue = client.queue.get(message.guild.id);
                let player = client.manager.get(message.guild.id);
                player.play(track);
                player.once('end', async data => {

                    if (queue.looping == true) return play(client, message, queue.songs[0].track)
                    queue.songs.shift();

                    if (!queue.songs.length) {
                        return leave(client, message);
                    }
                    const thu = queue.songs[0].info.identifier;
                    play(client, message, queue.songs[0].track);
                    const em = new MessageEmbed()
                        .setTitle('Now Playing:')
                        .setColor(0x2daa4b)
                        .setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
                        .setDescription(`
            Title: [${queue.songs[0].info.title}](${queue.songs[0].info.uri})\nAuthor: ${queue.songs[0].info.author}
            `);
                    return message.channel.send(em);

                });
            }
            catch (err) {
                console.log(err);
            }
        }
        async function join(client, message) {
            await client.manager.join({
                guild: message.guild.id,
                channel: message.member.voice.channel.id,
                host: client.lavalink.host
            }, {
		selfdeaf: true
	});
            console.log(`A player has spawned in ${message.guild.name} (${message.guild.id})`);
        }
        async function leave(client, message) {
            client.queue.delete(message.guild.id);
            message.channel.send('It appears as though there are no tracks playing. :thinking:');
            console.log(`A player has despawned in ${message.guild.name} (${message.guild.id})`);
            return await client.manager.leave(message.guild.id);
        }
	}
};
