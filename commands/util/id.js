module.exports = {
    name: 'id',
    description: 'Get your user ID if you don\'t like doing much.',
    args: false,
    async execute(message) {
        return message.channel.send(message.author.id);
    }
}