module.exports = async (client) => {
    const { walk } = require('walk');
    const { resolve } = require('path');
    const commandLoader = walk('./commands');

    commandLoader.on('file', async (root, stats, next) => {
        const command = require(`${resolve(root)}/${stats.name}`);
        command.category = root.split('/')[2] || command.category || 'etc';
        client.commands.set(command.name, command);
		next();
    });

    const nekosLife = new (require('nekos.life'))();
    client.nekosSafe = nekosLife.sfw;
    client.nekosUnSafe = nekosLife.nsfw;
    const actions = ['tickle', 'poke', 'feed', 'cuddle', 'hug'];
    const images = ['lizard', 'meow', 'smug', 'baka', 'woof'];
    const excludes = ['foxGirl', '8ball', 'why', 'catText', 'OwOify', 'fact', 'chat', 'nekoGif', 'spoiler'];
    delete client.nekosUnSafe.neko;
    delete client.nekosUnSafe.avatar;

    Object.entries(client.nekosUnSafe).map(x => {
        client.commands.set(x[0].toLowerCase(), {
            name: x[0].toLowerCase(),
            description: 'Just your average lewd',
            category: 'nsfw',
            cooldown: 5,
            voterOnly: true,
            donatorOnly: true,
            async execute(message) {
                if (!message.channel.nsfw) return message.channel.send('Nope. It\'s lewd. (Use the command in an nsfw channel.)');
                message.channel.send(new (require('discord.js').MessageEmbed)().setImage((await x[1]()).url));
            }
        });
    });
    Object.entries(client.nekosSafe).filter(x => !client.commands.has(x[0]) && actions.includes(x[0]) && !excludes.includes(x[0])).map(x => {
        client.commands.set(x[0].toLowerCase(), {
            name: x[0].toLowerCase(),
            description: 'Enact an action upon the other user!',
            category: 'img',
            cooldown: 5,
            voterOnly: false,
            donatorOnly: false,
            async execute(message, args) {
                const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
                message.channel.send({ content: `${target ? `${message.author} has enacted ${x[0]} on ${target}!` : `Guess it's my turn to ${x[0]} you, ${message.author}! >:3 `}`, embed: { image: { url: (await x[1]()).url } } });
            }
        });
    });
    
    Object.entries(client.nekosSafe).filter(x => !client.commands.has(x[0]) && images.includes(x[0]) && !excludes.includes(x[0])).map(x => {
        client.commands.set(x[0].toLowerCase(), {
            name: x[0].toLowerCase(),
            description: 'Your everyday images with this',
            category: 'img',
            cooldown: 5,
            voterOnly: false,
            donatorOnly: false,
            async execute(message) {
                message.channel.send(new (require('discord.js').MessageEmbed)().setImage((await x[1]()).url));
            }
        });
    });

};