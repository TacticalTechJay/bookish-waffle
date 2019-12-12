module.exports = {
    name: 'neko',
    description: 'Get a random image of a neko from nekos.life! (It\'s ~~kinda~~ safe do not worry.)',
    category: 'anime',
    cooldown: 5,
    guildOnly: false,
    args: false,
    async execute(message, args, client) {
        const { url } = await client.nekos.neko();
        const e = await client.nekos.nekoGif();
        const { MessageEmbed } = require('discord.js');
        if (message.channel.nsfw) {
            const embed = new MessageEmbed()
                .setTitle('Here is your neko!')
                .setImage(Math.random() > .5 ? url : e.url);
            return message.channel.send(embed)
        }
        const embed = new MessageEmbed()
            .setTitle('Here is your neko!')
            .setImage(url);
        message.channel.send(embed);
    }
}