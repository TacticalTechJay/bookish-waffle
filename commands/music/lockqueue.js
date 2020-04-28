module.exports = {
    name: 'lockqueue',
    description: 'Lock the queue from being added any more songs.',
    args: false,
    async execute(message, args, client) {
        const queue = client.queue.get(message.guild.id);
        if (!queue) return message.channel.send('The queue doesn\'t exist... ~~yet~~');
        if (queue.songs[0].requester.id !== message.author.id) return message.channel.send(`This is a sad problemo. You can not ${queue.locked ? 'disable' : 'enable'} it.`);
        queue.locked ? queue.locked == false : queue.locked == true;
        return message.channel.send(`The queue is now ${queue.locked ? 'locked to the requester of the current song.' : 'unlocked to be modified by anyone else.'}`);
    }
};