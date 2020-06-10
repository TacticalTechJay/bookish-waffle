const Command = require('../../structures/Command');

module.exports = class Blacklist extends Command {
    constructor(client) {
        super(client, {
            name: 'blacklist',
            aliases: ['bl'],
            devOnly: true,
            category: 'owner'
        });
    }
    async exec(message, args) {
        if (isNaN(args[0]) && args[0].length === 18 || args[0].length === 17) return message.channel.send('That does\'t look like an ID.');
        const user = await this.client.util.user(args[0]);
        if (user.blacklist) {
            user.blacklist = false;
            this.client.orm.repos.user.save(user);
            return message.channel.send('Removed from blacklist.');
        } else if (!user.blacklist) {
            user.blacklist = true;
            this.client.orm.repos.user.save(user);
            return message.channel.send('Added to blacklist.');
        }
    }
};