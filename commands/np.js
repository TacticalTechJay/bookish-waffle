module.exports = {
    name: 'np',
    description: 'Displays what is currently playing!',
    category: 'music',
    guildOnly: true,
    testing: false,
    cooldown: 5,
    aliases: ['nowplaying'],
    execute(message, a, client) {
        const { MessageEmbed } = require('discord.js');
        const serverQueue = client.queue.get(message.guild.id);
	    const player = client.manager.get(message.guild.id);
        if (!serverQueue) return message.channel.send('The server\'s queue is empty.');
        const embed = new MessageEmbed()
	        .setDescription(`Looping: ${serverQueue.looping ? 'Enabled' : 'Disabled'}\nSong Name: [${serverQueue.songs[0].info.title}](${serverQueue.songs[0].info.uri})\nAuthor: ${serverQueue.songs[0].info.author}\nDuration: ${require('moment').utc(player.state.position).format('H:mm:ss')} / ${require('moment').utc(serverQueue.songs[0].info.length).format('H:mm:ss')}${serverQueue.songs[0].requester ? `\nRequester: ${serverQueue.songs[0].requester.tag}` : null}`)
            .setColor(0x36bdfc)
	        .setThumbnail(`https://img.youtube.com/vi/${serverQueue.songs[0].info.identifier}/0.jpg?size=2048`);
        return message.channel.send(embed);
    }
};
