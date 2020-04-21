module.exports = {
    name: 'restart',
    description: 'null',
    args: false,
    guildOnly: false,
    group: 'trusted',
    async execute(message) {
        await message.channel.send('I will now die. <a:loading:416475652922015746>');
        process.exit(1);
    }
};