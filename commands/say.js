module.exports = {
    name: 'say',
    description: 'I speak for the trees. The trees say ***d i e***',
    category: 'util',
    guildOnly: false,
    args: true,
    usage: '<String>',
    execute(message, args, client) {
        const speech = args.join(' ');
        if (speech.toLowerCase().includes("nigga") || speech.toLowerCase().includes("porn")) return message.channel.send('**I\'d say all the things you would like but not that.**');
        return message.channel.send(speech);
    }
}