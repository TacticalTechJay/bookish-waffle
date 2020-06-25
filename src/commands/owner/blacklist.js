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
        if (isNaN(args[0]) || !args[0].length <= 18 && !args[0].length >= 17) return message.channel.send('That does\'t look like an ID.');
        const user = await this.client.util.user(args[0]);
        user.blacklist = !user.blacklist;
        await this.client.orm.repos.user.save(user);
        return user.blacklist ? message.channel.send('User has been added to blacklist.') : message.channel.send('User has been removed from blacklist.');
    }
};