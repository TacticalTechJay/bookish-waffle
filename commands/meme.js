const { ksoftapi } = require('../config.json')
module.exports = {
    name: 'meme',
    description: 'Dank memer but 99% better because of a cooldown freedom.',
    aliases: ['maymay', 'dankmaymay', 'meemee'],
    guildOnly: true,
    args: false,
    cooldown: 3,
    async execute(message) {
        const fetch = require('node-fetch');
        const res = await fetch('https://api.ksoft.si/images/rand-reddit/dankmemes?remove_nsfw=true&span=week', {
            headers: { 'Authorization': `Bearer ${ksoftapi}` }
        });
        const r = await res.json();
        const res2 = await fetch('https://api.ksoft.si/images/rand-reddit/dankmemes?remove_nsfw=true&span=week', {
            headers: { 'Authorization': `Bearer ${ksoftapi}` }
        });
        const r2 = await res2.json();
        let choice = [r, r2][Math.floor(Math.random() * 2)]
        const embed = new (require('discord.js').MessageEmbed)()
            .setTitle(choice.title)
            .setImage(choice.image_url)
            .setFooter(`From ${choice.subreddit} | Posted by ${choice.author}`);
        message.channel.send(embed);
    }
}