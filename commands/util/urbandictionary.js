module.exports = {
    name: 'urbandictionary',
    description: 'Get an urban dictionary definition right from https://urbandictionary.com',
    args: true,
    testing: false,
    cooldown: 5,
    aliases: ['ub'],
    usage: '<term>',
    async execute(message, args) {
        const fetch = require('node-fetch');
        const { MessageEmbed } = require('discord.js');
        const searchTerm = encodeURIComponent(args.join(' '));
        const res = await fetch(`https://api.urbandictionary.com/v0/define?term=${searchTerm}`);
        const json = await res.json();
        if (!message.channel.nsfw) return message.channel.send('Sorry but, this command can not be used outside of NSFW channels!');
        if (!json) return message.channel.send('No results found for ' + args.join(' '));
        const embed = new MessageEmbed()
            .setTitle(`First result for ${args.join(' ')}`)
            .setDescription(`**Definition**: ${json.list[0].definition}\n**Author**: ${json.list[0].author}\n**Definition Url**: ${json.list[0].permalink}`)
            .setColor(0x1C223A)
            .setThumbnail('https://upload.wikimedia.org/wikipedia/vi/7/70/Urban_Dictionary_logo.png');
        return message.channel.send(embed);
    }
};
