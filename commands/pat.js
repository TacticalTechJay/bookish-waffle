const config = require('../config.json')
module.exports = {
    name: 'pat',
    description: 'Pat others or request to get a pat from the bot!',
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
        const res = await fetch('https://api.ksoft.si/images/random-image?tag=pat', {
            headers: { 'Authorization': `Bearer ${config.ksoftapi}` }
        })
        const { url } = await res.json()
        const embed = new MessageEmbed()
            .setDescription(target ? `${target} was patted by ${message.author}!` : `${message.author} seems lonely. How about I help with this!`)
            .setImage(url)
        message.channel.send(embed);
    }
}