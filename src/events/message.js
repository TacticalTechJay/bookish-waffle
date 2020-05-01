const { Event } = require('../structures/Event');

module.exports = class Message extends Event {
    constructor(client) {
        super(client, {
            name: 'message'
        });
    }
    async exec(message) {
        if (message.author.bot || !message.guild) return;
        const { content, flags } = this.client.util.parseFlags(message.content);
        message.content = content;
        message.flags = flags;
        const guild = await message.guild.settings()
        if (!message.content.toLowerCase().startsWith(guild.prefix)) return;
        const args = message.content.toLowerCase().slice(guild.prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        const cmd = this.client.handler.commands.get(command) || this.client.handler.commands.get(this.client.handler.aliases.get(command));
        if (!cmd) return;
        if (cmd.devOnly && !this.client.devs.includes(message.author.id)) return;
        try {
            cmd.exec(message, args);
        } catch (e) {
            message.channel.send(e);
        }
    }
}