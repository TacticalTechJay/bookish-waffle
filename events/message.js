const Sentry = require('@sentry/node');
const { sys } = require('../config.json');
const { Collection } = require('discord.js');
const cooldowns = new Collection();

module.exports = {
    name: 'message',
    async exec(message, client) {
        if (message.channel.type !== 'text' || !message.content.toLowerCase().startsWith(client.prefix) || message.author.bot) return;
        const { content, flags } = client.utils.parseFlags(message.content);
        message.content = content;
        message.flags = flags;
        const args = message.content.slice(client.prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        const user = await client.utils.database.user(client, message.author.id);

        if (!command) return;
        if (typeof client.dbl !== 'undefined') {
            const voted = await client.dbl.hasVoted(message.author.id);
            if (command.voterOnly && !command.donatorOnly && !voted) return message.channel.send('Woah there! This command is for voters only! Vote on DBL to use this command. Vote here!\n<https://top.gg/bot/628802763123589160/vote>');
            if (command.donatorOnly && !command.voterOnly && !user.donator) return message.channel.send(`Woah there! This command is for donators only! Donate more than one cup of coffee on KoFi to use these commands (Be sure to include your user ID: \`${message.author.id}\`). Donation link: <https://www.ko-fi.com/earthchandiscord>`);
            if (command.voterOnly && command.donatorOnly && !voted && !user.donator) return message.channel.send(`Woah there! This command is only for voters/donators! Vote on Discord Bot List to use this command or donate more than just a cup off coffee on KoFi with your user ID in the message (\`${message.author.id}\`) included in the message.\nDonation link: <https://www.ko-fi.com/earthchandiscord>\nVote link: <https://top.gg/bot/628802763123589160/vote>`);
        }
        if (command.category == 'dev' && !sys.groups[command.group].includes(message.author.id)) return;

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${client.prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }

        if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
        const cooldownDonAmount = ((command.cooldown - 2 < 0 ? 1 : command.cooldown - 2)) * 1000;

        if (!timestamps.has(message.author.id)) {
            timestamps.set(message.author.id, now);
            if (user.donator) setTimeout(() => timestamps.delete(message.author.id), cooldownDonAmount);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
        else {
            let expirationTime;
            if (user.donator) expirationTime = timestamps.get(message.author.id) + cooldownDonAmount;
            else expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

        try {
            await command.execute(message, args, client, user);
            console.log(`${message.guild.id} | ${command.name}`);
        }
        catch (error) {
            Sentry.captureException(error);
            console.error(`${message.guild.id} | ${command.name}:\n${error.stack}`);
            message.channel.send('There seemd to be a problem while using this command. It has been reported already to the developer(s). Hold tight! We\'re coming for rescue! ');
        }
    }
};
