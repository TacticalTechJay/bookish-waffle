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
			let evaled = await eval(code);
			if (typeof evaled !== 'string') {
<<<<<<< HEAD
				evaled = require('util').inspect(evaled, false, 1);
=======
				evaled = require('util').inspect(evaled, {depth: 0});
>>>>>>> 3fd5ae6ce773aec981b55a273e29e4f6aa8488c7
			}
			if (evaled.includes(client.token)) return message.channel.send('```Nice try FBI.```');
			message.channel.send(`\`\`\`js\n${clean(evaled)}\`\`\``);
		}
		catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
    }
}
