const { execSync } = require('child_process');
const { sys } = 

module.exports = {
    name: 'git',
    description: null,
    category: 'useful',
    cooldown: 1,
    group: 'trusted',
    async execute(message) {
        try {
            const executedPiece = await execSync('git pull').toString();
            if (executedPiece.startsWith('Already up to date')) return message.channel.send('The focuesed branch is up to date.');
            if (client.manager.players.size == 0) return message.channel.send('There are currently people vibing to music. Try again later.');
            await message.channel.send(`\`\`\`${executedPiece}\`\`\``);
            process.exit(1);
        } catch (err) {
            message.author.send(err);
        }
    }
}