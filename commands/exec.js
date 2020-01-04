const { exec } = require('child_process');
module.exports = {
    name: 'exec',
    description: null,
    cooldown: 1,
    async execute(message, args, client) {
        if (!client.db.get('trusted').includes(message.author.id)) return;
		if (!args[0]) return message.channel.send('```COMMAND REQUIRED```');
		try {
			exec(args.join(' '), (err, stdout, stderr) => {
				if (stderr) return message.channel.send({ embed: { description: stderr } });
				message.channel.send(`\`\`\`${stdout}\`\`\``);
			});
		}
		catch (err) {
			console.log(err);
		}
    }
}