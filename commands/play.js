module.exports = {
    name: 'play',
    description: 'Play music in a voice channel you\'re in... at high quality. :sunglasses:',
    category: 'music',
    args: true,
    guildOnly: true,
    testing: false,
    cooldown: 5,
    aliases: ['p'],
    usage: '<SongURL/SearchString>',
    async execute(message, args, client) {
        const { MessageEmbed } = require('discord.js');
        if (!message.member.voice.channel) return message.channel.send('You must be in a voice channel!');
        if (message.guild.me.voice.channel) {
            if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('No.');
        }
		if (!message.member.guild.me.hasPermission(['SPEAK', 'CONNECT', 'VIEW_CHANNEL'])) return message.channel.send('I do not have the required permissions to play music');
		if (!message.member.voice.channel.permissionsFor(message.guild.me).has(['SPEAK', 'CONNECT', 'VIEW_CHANNEL'])) return message.channel.send('I do not have the required permisssions to play music');
        const player = await client.manager.get(message.guild.id);
        if (!player) {
            if (!client.queue.get(message.guild.id)) createQueue(client, message.guild.id);
            if (client.queue.get(message.guild.id)) {
                if (!args.join(' ')) return play(client, message);
            }
        }
        if (args.join(' ').startsWith('http')) {
            getSong(`${args.join(' ')}`, message, message.client);
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
            if (!res2.tracks[0]) throw 'NO TRACKS';
            return res2;
        }
        async function createQueue(client, guild) {
            client.queue.set(guild, {
                songs: [],
                looping: false
            });
        }
        async function getSong(string, message, client) {
            getSongs(string, client).then(async song => {
                if (!song) return message.channel.send('No tracks were found');
                if (!client.queue.get(message.guild.id)) createQueue(client, message.guild.id);

                const thu = song.tracks[0].info.identifier;

                if (!client.manager.get(message.guild.id)) await join(client, message);
                let player = client.manager.get(message.guild.id);
                if (player.playing === false) {
                    song.tracks[0].requester = message.author;
                    play(client, message, song.tracks[0].track);
                    client.queue.get(message.guild.id).songs.push(song.tracks[0]);
                    const em = new MessageEmbed()
                        .setTitle('Now Playing:')
                        .setColor(0x2daa4b)
                        .setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
                        .setDescription(`
            Title: [${song.tracks[0].info.title}](${song.tracks[0].info.uri})\nAuthor: ${song.tracks[0].info.author}\nLength: ${require('moment').utc(song.tracks[0].info.length).format('H:mm:ss')}
            `);
                    message.channel.send(em);
                }
                else {
                    song.tracks[0].requester = message.author;
                    client.queue.get(message.guild.id).songs.push(song.tracks[0]);
                    const em = new MessageEmbed()
                        .setTitle('Added To Queue:')
                        .setColor(0x2697ff)
                        .setThumbnail(`https://img.youtube.com/vi/${thu}/0.jpg`)
                        .setDescription(`
            Title: [${song.tracks[0].info.title}](${song.tracks[0].info.uri})\nAuthor: ${song.tracks[0].info.author}\nLength: ${require('moment').utc(song.tracks[0].info.length).format('H:mm:ss')}
            `);
                    message.channel.send(em);
                }
            }).catch(err => {
                console.log(err);
                return message.channel.send('There was an error. ' + err);
            });
        }
        async function play(client, message, track) {
            try {
                const queue = client.queue.get(message.guild.id);
                const player = client.manager.get(message.guild.id);
                player.play(track);
                player.once('end', async data => {

                    if (queue.looping == true) return play(client, message, queue.songs[0].track);
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
