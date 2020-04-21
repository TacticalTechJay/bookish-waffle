const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'upvote',
    description: 'Vote for the bot! :D',
    testing: false,
    args: false,
    cooldown: 5,
    execute(message, rand, client) {
        const embed = new MessageEmbed()
            .setTitle('Voting!')
            .setDescription('You can vote for me at either of these bot lists below.')
            .addField('Discord Bots List', `[Here! 🎉](https://discordbotlist.com/bots/${client.user.id}/upvote)`)
            .addField('Top List', `[Here! 🎉](https://top.gg/bot/${client.user.id}/vote)`)
            .addField('Abstract Discord List', `[Here! 🎉](https://abstractlist.net/bot/${client.user.id}/vote)`)
            .addField('Discord Labs Bot List', `[Here! 🎉](https://bots.discordlabs.org/bot/${client.user.id}/vote)`);
        message.channel.send(embed);
    }
};
