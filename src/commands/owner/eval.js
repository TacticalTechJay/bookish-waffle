const Command = require('../../structures/Command');
const { inspect } = require('util');

module.exports = class Evaluation extends Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            aliases: ['ev'],
            devOnly: true,
            category: 'owner'
        });
    }

    async exec(message, args) {
        if (!args[0]) return message.channel.send('evaluation needed');
        let input = args.join(' ');
        if (input.startsWith('```js') || input.startsWith('```') && input.endsWith('```')) {
            input = input.replace(/`/gi, '')
                .replace(/js/gi, '');
        }
        try {
            let evaled;
            if (message.flags.a || message.flags.async) {
                evaled = await eval(`(async() => { ${input} })()`);
            } else {
                evaled = await eval(input);
            }
            let evaluation = inspect(evaled, { depth: message.flags.depth || 0 });
            let dataType = Array.isArray(evaled) ? 'Array<' : typeof evaled, dataTypes = [];
            if (~dataType.indexOf('<')) {
                evaled.forEach(d => {
                    if (~dataTypes.indexOf(Array.isArray(d) ? 'Array' : typeof d)) return;
                    dataTypes.push(Array.isArray(d) ? 'Array' : typeof d);
                });
                dataType += dataTypes.map(s => s[0].toUpperCase() + s.slice(1)).join(', ') + '>';
            }
            if (evaluation.length >= 1000) {
                const url = (await this.client.util.uploadToHastebin(evaluation)).url;
                return message.channel.send(url);
            }
            return await message.channel.send(`**Done Evaluation:** \`\`\`js\n${evaluation}\`\`\`\n`);
        } catch (e) {
            return await message.channel.send(`**Error:** \`\`\`js\n${e.message}\`\`\``);
        }
    }
};