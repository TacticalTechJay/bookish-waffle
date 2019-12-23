const fetch = require('node-fetch');
let config = require('../config.json');
module.exports = {
    name: 'yaoi',
    description: 'Just your avergae lewd.',
    category: 'nsfw',
    cooldown: 5,
    voterOnly: true,
    donatorOnly: true,
    async execute(message, args, client) {
        if (!message.channel.nsfw) return message.channel.send('Nope. It\'s lewd. (Use this command in an nsfw channel.)');
        const r = await fetch('https://api.ksoft.si/images/rand-reddit/yaoi', {
            headers: {
                'Authorization': `Bearer ${config.ksoftapi}`
            }
        });
        const { image_url } = await r.json();
        message.channel.send(new (require('discord.js').MessageEmbed)().setImage(image_url));
    }
}