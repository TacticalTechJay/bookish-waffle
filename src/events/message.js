const Event = require('../structures/Event');
const Sentry = require('@sentry/node');

module.exports = class Message extends Event {
    constructor(client) {
        super(client, {
            name: 'message'
        });
    }
    async exec(message) {
        if (message.author.bot || !message.guild) return;
        const guild = await message.guild.settings();
        const user = await message.author.data();
        const { content, flags } = this.client.util.parseFlags(message.content);
        message.content = content;
        message.flags = flags;
        if (!message.content.toLowerCase().startsWith(guild.prefix)) return;
        const args = message.content.slice(guild.prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        const cmd = this.client.handler.commands.get(command) || this.client.handler.commands.get(this.client.handler.aliases.get(command));
        if (!cmd) return;
        if (cmd.devOnly && !this.client.devs.includes(message.author.id)) return;
        if (user.blacklist && !this.client.devs.includes(message.author.id)) return message.channel.send(`You are blacklisted from using ${this.client.user.username}`);
        if (cmd.superPremium && !user.premium.donator) return message.channel.send('Sorry to poop on your party but, this command is reserved for donators.\nIf you\'d like to use this command, be sure to donate on Patreon.');
        try {
            await this.client.statcord.postCommand(cmd.name, message.author.id);
            this.client.logger.info(`command "${cmd.name}" executed in ${message.guild.id}`);
            return cmd.exec(message, args);
        } catch (e) {
            Sentry.captureException(e);
            this.client.logger.error(`sentry exception captured from "${cmd.name}": ${e}`);
            return message.channel.send('Boo! Something went wrong when running that command, but it has been reported to my developers, so you are safe!');
        }
    }
};