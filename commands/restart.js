module.exports = {
    name: 'restart',
    description: 'null',
    args: false,
    guildOnly: false,
    async execute(message) {
        if (message.author.id !== '127888387364487168') return;
        await message.channel.send('I will now die. <a:loading:416475652922015746>');
        process.exit(1);
    }
};