const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class UpVote extends Command {
    constructor(client) {
        super(client, {
            name: 'upvote',
            description: 'Upvote for me on many botlists',
            aliases: ['vote']
        });
    }

    async exec(message) {
        return message.channel.send(
            new MessageEmbed()
                .setTitle('Thank you for choosing to vote!')
                .setColor(this.client.color)
                .setDescription('You can vote for me at either of these bot lists below.')
                .addField('(Primary) DBL', `[Here! 🎉](https://discordbotlist.com/bots/${this.client.user.id}/upvote)`)
                .addField('Discord Bot List', `[Here! 🎉](https://top.gg/bot/${this.client.user.id}/vote)`)
                .addField('Abstract Discord List', `[Here! 🎉](https://abstractlist.net/bot/${this.client.user.id}/vote)`)
                .addField('Discord Labs Bot List', `[Here! 🎉](https://bots.discordlabs.org/bot/${this.client.user.id}/vote)`)
        );
    }
};