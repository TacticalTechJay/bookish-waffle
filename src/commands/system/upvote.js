const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class UpVote extends Command {
    constructor(client) {
        super(client, {
            name: 'upvote',
            description: `Upvote for me on many botlists`
        });
    }

    async exec(message, args) {
        return message.channel.send(
            new MessageEmbed()
                .setTitle('Thank you for choosing to vote!')
                .setColor(this.client.color)
                .setDescription('You can vote for me at either of these bot lists below.')
                .addField('Discord Bots List', `[Here! 🎉](https://discordbotlist.com/bots/${this.client.user.id}/upvote)`)
                .addField('Top List', `[Here! 🎉](https://top.gg/bot/${this.client.user.id}/vote)`)
                .addField('Abstract Discord List', `[Here! 🎉](https://abstractlist.net/bot/${this.client.user.id}/vote)`)
                .addField('Discord Labs Bot List', `[Here! 🎉](https://bots.discordlabs.org/bot/${this.client.user.id}/vote)`)
        );
    }
}