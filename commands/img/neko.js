module.exports = {
    name: 'neko',
    description: 'Get a random image of a neko from nekos.life! (It\'s ~~kinda~~ safe do not worry.)',
    cooldown: 5,
    args: false,
    async execute(message, args, client) {
        let url = await client.nekosSafe.neko();
        const e = await client.nekosSafe.nekoGif();
        const { MessageEmbed } = require('discord.js');
        if (message.channel.nsfw) {
            const fetch = require('node-fetch');
            const { stable, beta } = require('../../config.json');
            const ksoftapi = parseInt(process.env.MODE) ? stable.ksoftapi : beta.ksoftapi;
            const res = await fetch('https://api.ksoft.si/images/random-image?tag=neko&nsfw=true', {
                headers: { 'Authorization': `Bearer ${ksoftapi}` }
            });
            url = await res.json();
            const embed = new MessageEmbed()
                .setTitle('Here is your neko!')
                .setImage(Math.random() > 0.5 ? url.url : e.url);
            return message.channel.send(embed);
        }
        const embed = new MessageEmbed()
            .setTitle('Here is your neko!')
            .setImage(url.url);
        message.channel.send(embed);
    }
};
