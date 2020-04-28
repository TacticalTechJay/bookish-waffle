const { Event } = require('../structures/Event');

module.exports = class Message extends Event {
    constructor(client) {
        super(client, {
            name: 'message'
        });
    }
    async exec(message) {
        // console.log(message);
        if (message.author.bot || !message.guild) return;
        if (!message.content.toLowerCase().startsWith('pluto ')) return;
        const args = message.content.toLowerCase().slice('pluto '.length).split(/ +/);
        const command = args.shift().toLowerCase();
        const cmd = this.client.handler.commands.get(command) || this.client.handler.commands.get(this.client.handler.aliases.get(command));
        if (!cmd) return;
        try {
            cmd.exec(message, args);
        } catch (e) {
            message.channel.send(e);
        }
    }
}