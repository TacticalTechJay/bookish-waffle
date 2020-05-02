const { stable, beta } = require('../../config.json');
const ksoftapi = Number(process.env.MODE) ? stable.ksoftapi : beta.ksoftapi;
module.exports = {
    name: 'pat',
    description: 'Pat others or request to get a pat from the bot!',
    testing: false,
    args: false,
    cooldown: 3,
    usage: '[String:Mention | Int:ID]',
    async execute(message, args) {
        const fetch = require('node-fetch');
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const res = await fetch('https://api.ksoft.si/images/random-image?tag=pat', {
            headers: { 'Authorization': `Bearer ${ksoftapi}` }
        });
        const { url } = await res.json();
        message.channel.send({ content: `${target ? `${target} was slapped by ${message.author}!` : `${message.author} you wanted it, so you'll get it.`}`, embed: { image: { url: url } } });
    }
};
