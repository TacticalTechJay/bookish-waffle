const config = require('../config.json');
module.exports = {
    name: 'kiss',
    description: 'Show affection towards others or the bot can show affection to you.',
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
        const res = await fetch('https://api.ksoft.si/images/random-image?tag=kiss', {
            headers: { 'Authorization': `Bearer ${config.ksoftapi}` }
        });
        const { url } = await res.json();
        const embed = new MessageEmbed()
            .setDescription(target ? `${target} was kissed by ${message.author}!` : `${message.author}, why are you alone here? How about I help with this!`)
            .setImage(url);
        message.channel.send(embed);
    }
}
