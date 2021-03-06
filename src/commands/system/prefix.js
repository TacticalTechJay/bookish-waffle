const Command = require('../../structures/Command');
const config = require('../../../config.json');

module.exports = class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'prefix',
            description: 'Change my prefix so you can make the bot.. your own!',
            usage: '[Prefix? = reset | other]'
        });
    }

    async exec(message, args) {
        const member = message.guild.member(message.author);
        if (!this.client.devs.includes(message.author.id)) if (!member.hasPermission('MANAGE_GUILD')) return message.channel.send('Bummer, you need the `Manage Server` permission to change the prefix :|');
        const guild = await message.guild.settings();
        if (!args[0]) return message.channel.send(`The guild's prefix right now is ${guild.prefix}`);
        if (args[0].toLowerCase() === 'reset') guild.prefix = process.env.DEVELOPMENT ? config.prefixes.dev : config.prefixes.prod;
        else guild.prefix = args.join(' ');
        this.client.orm.repos.guild.save(guild);
        return message.channel.send(`Alright, you can now use \`${guild.prefix}\` as my prefix.`);
    }
};