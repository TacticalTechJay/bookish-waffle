module.exports = {
    name: 'fox',
    description: 'Get a random image of a fox girl from nekos.life! (It\'s ~~kinda~~ safe so don\'t worry.)',
    category: 'anime',
    cooldown: 5,
    guildOnly: false,
    args: false,
    async execute(message, args, client) {
        const { url } = await client.nekosSafe.foxGirl();
        const { MessageEmbed } = require('discord.js');
        const embed = new MessageEmbed()
            .setTitle('Here is your fox girl!')
            .setImage(url);
        message.channel.send(embed);
    }
};
