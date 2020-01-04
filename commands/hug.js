const config = require('../config.json');
module.exports = {
    name: 'hug',
    description: 'Hug others or request to get a hug from the bot!',
    category: 'anime',
    guildOnly: true,
    testing: false,
    args: false,
    cooldown: 3,
    usage: '<mention>',
    async execute(message, args, client) {
        const fetch = require('node-fetch');
        const { MessageEmbed } = require('discord.js');
        const target = message.mentions.members.first() || message.guild.members.get(args[0]);
        const res = await fetch('https://api.ksoft.si/images/random-image?tag=hug', {
            headers: { 'Authorization': `Bearer ${config.ksoftapi}` }
        });
        const { url } = await res.json();
        const embed = new MessageEmbed()
            .setDescription(target ? `${target} was hugged by ${message.author}!` : `${message.author} seems lonely. How about I help with this!`)
            .setImage(url);
        message.channel.send(embed);
    }
}
