const { ksoftapi } = require('../config.json')
module.exports = {
    name: 'meme',
    description: 'Dank memer but 99% better because of a lower cooldown.',
    aliases: ['maymay', 'dankmaymay', 'meemee', 'memes'],
    guildOnly: true,
    args: false,
    cooldown: 3,
    async execute(message) {
        const fetch = require('node-fetch');
        let choice = ['dankmemes', 'memes', 'me_irl', 'meirl', 'crappydesign', 'hmm'][Math.floor(Math.random() * 6)]
        console.log(choice);
        const res = await fetch(`https://api.ksoft.si/images/rand-reddit/${choice}?remove_nsfw=true&span'=week'`, {
            headers: { 'Authorization': `Bearer ${ksoftapi}` }
        });
        const r = await res.json();
        const embed = new (require('discord.js').MessageEmbed)()
            .setTitle(r.title)
            .setImage(r.image_url)
	        .setURL(r.source)
            .setFooter(`From ${r.subreddit} | Posted by ${r.author}`);
        message.channel.send(embed);
    }
}
