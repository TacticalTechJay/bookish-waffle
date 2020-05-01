const { Command } = require('../../structures/Command');
const { inspect } = require('util');

module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'reload',
            aliases: ['r'],
            devOnly: true,
            category: 'owner'
        });
    }

    async exec(message, args) {

        try {
            this.client.handler.loadCommands();
            return message.channel.send(`I reloaded everything.`);
        } catch (e) {
            return await message.channel.send(`**Error:** \`\`\`js\n${e.message}\`\`\``);
        }
    }
}