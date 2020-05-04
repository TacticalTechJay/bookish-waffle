const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class Restart extends Command {
    constructor(client) {
        super(client, {
            name: 'restart',
            devOnly: true
        });
    }

    async exec(message, args) {
        message.channel.send(`👋 Deed is active.`).then(_ => process.exit(1));
    }
}