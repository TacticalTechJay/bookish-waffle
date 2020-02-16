const Discord = require('discord.js');
module.exports = {
    name: 'invite',
    description: 'Invite me into your server!',
    category: 'general',
    guildOnly: false,
    args: false,
    testing: false,
    execute(message, rand, client) {
        const embed = new Discord.MessageEmbed()
            .setColor(0x00fa69)
            .setTitle('Invite me!')
            .setDescription(`Thank you for taking consideration into inviting me!\n[Link is here!](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=3353606)`);
        message.channel.send(embed);
    }
};
