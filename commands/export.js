module.exports = {
    name: 'export',
    description: 'Save the queue for future repeated use.',
    aliases: ['qsave'],
    args: false,
    guildOnly: true,
    category: 'music',
    async execute(message, args, client) {
        const queue = client.queue.get(message.guild.id);
        const qsave = client.qsaves.get(`g${message.guild.id}me${message.author.id}`);
        if (!message.guild.me.voice.channel) return message.channel.send('I am not in a voice channel right now.');
        if (!message.member.voice.channel || message.guild.me.voice.channel !== message.member.voice.channel) return message.channel.send('You need to be in the same voice channel as me to use this command!');
        if (!queue || !queue.songs || queue.songs.length < 2) return message.channel.send('You should get a queue filled up!');
        if (qsave) {
            message.channel.send('**Are you sure you want to replace your currently saved queue?**\n**Yes** or **No**');
            try {
                const r = await message.channel.awaitMessages(m2 => m2.content.toLowerCase() == 'yes' || m2.content.toLowerCase() == 'no' && m2.author.equals(message.author) && !m2.content.startsWith(client.prefix), {
                    max: 1,
                    time: 15000,
                    errors: ['time']
                });
                if (r.first().content.toLowerCase() == 'yes') {
                    await client.qsaves.set(`g${message.guild.id}me${message.author.id}`, queue.songs);
                    return message.channel.send('Saved! <:tickYes:315009125694177281>');
                }
 else if (r.first().content.toLowerCase() == 'no') {return message.channel.send('Canceled.');}
            }
 catch (e) {
                if (e.size == 0) return message.channel.send('No response was provided.');
                return console.error(e);
            }
        }
        queue.songs.forEach(s => client.qsaves.set(`g${message.guild.id}me${message.author.id}`, s));
        client.qsaves.set(`g${message.guild.id}me${message.author.id}`, queue.songs);
        return message.channel.send('Saved! <:tickYes:315009125694177281>');
    }
};
