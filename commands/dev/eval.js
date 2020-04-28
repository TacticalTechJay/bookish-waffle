module.exports = {
    name: 'eval',
    description: '?',
    cooldown: 0,
    group: 'superTrusted',
    async execute(message, args, client) {
        const clean = text => {
            if (typeof (text) === 'string') {
                return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
            }
            else {
                return text;
            }
        };
        try {
            let code = args.join(' ');
			if (message.flags.a || message.flags.async) code = `(async()=>{${code}})();`;
            let evaled = await eval(code);
            if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled, { depth: 0 });
            }
            if (evaled.includes(client.token)) return message.channel.send('\`\`\`Nice try FBI.\`\`\`');
            message.channel.send(`\`\`\`js\n${clean(evaled)}\`\`\``);
        }
        catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
};