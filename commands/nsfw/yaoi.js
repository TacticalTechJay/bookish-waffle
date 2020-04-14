const fetch = require('node-fetch');
const { stable, beta } = require('../../config.json');
const ksoftapi = parseInt(process.env.MODE) ? stable.ksoftapi : beta.ksoftapi;
module.exports = {
    name: 'yaoi',
    description: 'Just your avergae lewd.',
    cooldown: 5,
    voterOnly: true,
    donatorOnly: true,
    async execute(message) {
        if (!message.channel.nsfw) return message.channel.send('Nope. It\'s lewd. (Use this command in an nsfw channel.)');
	if (message.guild.id == '620424864221757481') return message.channel.send('No gay shit dude.');
        const r = await fetch('https://api.ksoft.si/images/rand-reddit/yaoi', {
            headers: {
                'Authorization': `Bearer ${ksoftapi}`
            }
        });
        const { image_url } = await r.json();
        message.channel.send(new (require('discord.js').MessageEmbed)().setImage(image_url));
    }
};
