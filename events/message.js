module.exports = {
    name: 'message',
    async exec(message, client, cooldowns) {
        if (!message.content.toLowerCase().startsWith(client.prefix) || message.author.bot) return;
        const args = message.content.slice(client.prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        const { Collection } = require('discord.js');

        if (!command) return;
        if (typeof client.dbl !== 'undefined') {
            const voted = await client.dbl.hasVoted(message.author.id);
            if (command.voterOnly && !command.donatorOnly && !voted) return message.channel.send('Woah there! This command is for voters only! Vote on DBL to use this command. Vote here!\n<https://top.gg/bot/628802763123589160/vote>');
            if (command.donatorOnly && !command.voterOnly && !client.db.get('donor').includes(`member_${message.author.id}`)) return message.channel.send(`Woah there! This command is for donators only! Donate more than one cup of coffee on KoFi to use these commands (Be sure to include your user ID: \`${message.author.id}\`). Donation link: <https://www.ko-fi.com/earthchandiscord>`);
            if (command.voterOnly && command.donatorOnly && !voted && !client.db.get('donor').includes(`member_${message.author.id}`)) return message.channel.send(`Woah there! This command is only for voters/donators! Vote on Discord Bot List to use this command or donate more than just a cup off coffee on KoFi with your user ID in the message (\`${message.author.id}\`) included in the message.\nDonation link: <https://www.ko-fi.com/earthchandiscord>\nVote link: <https://top.gg/bot/628802763123589160/vote>`);
        }
        if (command.testing && message.author.id != 127888387364487168) return message.reply(`${command.name} is currently in its testing stage.`);
        if (command.guildOnly && message.channel.type !== 'text') return message.reply('I can\'t execute that command inside DMs!');

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
            if (client.db.get('donor').includes(`member_${message.author}`)) setTimeout(() => timestamps.delete(message.author.id), cooldownDonAmount);
            else setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
        else {
            let expirationTime;
            if (client.db.get('donor').includes(`member_${message.author.id}`)) expirationTime = timestamps.get(message.author.id) + cooldownDonAmount;
            else expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

        try {
            await command.execute(message, args, client);
            console.log(`${message.guild ? message.guild.id : `DM: ${message.channel.id}`} | ${command.name}`);
        }
        catch (error) {
            console.error(`${message.guild ? message.guild.id : 'DM: ' + message.channel.id} | ${command.name}:\n${error.stack}`);
            message.reply(`there was an error trying to execute that command! Report this to the creator of this bot: \`${error}\``);
        }
    }
};