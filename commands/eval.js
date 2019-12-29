module.exports = {
    name: 'eval',
    description: '?',
    guildOnly: false,
    testing: false,
    cooldown: 0,
    async execute(message, args, client, dbl) {
        if (!client.db.get('trusted').includes(message.author.id)) return;
		const clean = text => {
			if (typeof (text) === 'string') {
				return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
			}
			else {
				return text;
			}
		};
		try {
			const code = args.join(' ');
			if (args.includes('token')) return message.channel.send('```Nope.```');
			let evaled = await eval(code);
			if (typeof evaled !== 'string') {
				evaled = require('util').inspect(evaled, false, 0);
			}
			if (evaled.includes(client.token)) return message.channel.send('```Nice try FBI.```');
			message.channel.send(`\`\`\`js\n${clean(evaled)}\`\`\``);
		}
		catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
    }
}