module.exports = {
    name: 'neko',
    description: 'Get a random image of a neko from nekos.life! (It\'s ~~kinda~~ safe do not worry.)',
    category: 'anime',
    cooldown: 5,
    guildOnly: false,
    args: false,
    async execute(message, args, client) {
        let url = await client.nekosSafe.neko();
        const unsafe = require('nekos.life');
        const UnSafe = (new unsafe()).nsfw;
        const e = await client.nekosSafe.nekoGif();
        const { MessageEmbed } = require('discord.js');
        if (message.channel.nsfw) {
            url = await UnSafe.neko();
            const embed = new MessageEmbed()
                .setTitle('Here is your neko!')
                .setImage(Math.random() > .5 ? url.url : e.url);
            return message.channel.send(embed)
        }
        const embed = new MessageEmbed()
            .setTitle('Here is your neko!')
            .setImage(url.url);
        message.channel.send(embed);
    }
}
