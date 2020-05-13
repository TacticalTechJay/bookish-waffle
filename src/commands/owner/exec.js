const Command = require('../../structures/Command');
const { execSync } = require('child_process');

module.exports = class Execute extends Command {
    constructor(client) {
        super(client, {
            name: 'exec',
            aliases: ['ex'],
            devOnly: true,
            category: 'owner'
        });
    }

    async exec(message, args) {
        if (!args[0]) return message.channel.send('evaluation needed');
        let input = args.join(' ');
        try {
            const out = execSync(input);
            return message.channel.send(`\`\`\`${out.toString()}\`\`\``);
        } catch (e) {
            return message.channel.send(e.message);
        }
    }
};