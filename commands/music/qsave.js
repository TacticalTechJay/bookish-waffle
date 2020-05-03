module.exports = {
    name: 'qsave',
    description: 'Save the queue for future repeated use.',
    aliases: ['sq', 'export'],
    args: true,
    cooldown: 5,
    usage: '<String>',
    async execute(message, args, client, user) {
        const queue = client.queue.get(message.guild.id);
        const userChoice = args.join(' ').replace(/[^\w- ]/g, '');
        if (!message.guild.me.voice.channel) return message.channel.send('I am not in a voice channel right now.');
        if (!message.member.voice.channel || message.guild.me.voice.channel !== message.member.voice.channel) return message.channel.send('You need to be in the same voice channel as me to use this command!');
        if (!queue || !queue.songs || queue.songs.length < 2) return message.channel.send('You should get a queue filled up!');
        if (!userChoice) return message.channel.send('That is not a valid name!');
        if (user.queues[userChoice]) {
            message.channel.send('**Are you sure you want to replace your currently saved queue?**\n**Yes** or **No**');
            try {
                const r = await message.channel.awaitMessages(m2 => m2.content.toLowerCase() == 'yes' || m2.content.toLowerCase() == 'no' && m2.author.equals(message.author) && !m2.content.startsWith(client.prefix), {
                    max: 1,
                    time: 15000,
                    errors: ['time']
                });
                if (r.first().content.toLowerCase() == 'yes') {
                    user.queues[userChoice] = queue.songs.map(s => s.info.uri);
                    await client.orm.repos.user.save(user);
                    return message.channel.send('Saved! <:tickYes:315009125694177281>');
                }
            else if (r.first().content.toLowerCase() == 'no') return message.channel.send('Canceled.');
            }
            catch (e) {
                if (e.size == 0) return message.channel.send('No response was provided.');
                return console.error(e);
            }
        }
        user.queues[userChoice] = queue.songs.map(s => s.info.uri);
        await client.orm.repos.user.save(user);
        return message.channel.send('Saved! <:tickYes:315009125694177281>');
    }
};
