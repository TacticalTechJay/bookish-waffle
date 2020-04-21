const { stable, beta } = require('../../config.json');
const ksoftapi = parseInt(process.env.MODE) ? stable.ksoftapi : beta.ksoftapi;
module.exports = {
    name: 'hug',
    description: 'Hug others or request to get a hug from the bot!',
    testing: false,
    args: false,
    cooldown: 3,
    usage: '<mention>',
    async execute(message, args) {
        const fetch = require('node-fetch');
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const res = await fetch('https://api.ksoft.si/images/random-image?tag=hug', {
            headers: { 'Authorization': `Bearer ${ksoftapi}` }
        });
        const { url } = await res.json();
        message.channel.send({ content: `${target ? `${target} was hugged by ${message.author}!` : `${message.author} seems lonely. How about I help with this!`}`, embed: { image: { url: url } } });
    }
};
