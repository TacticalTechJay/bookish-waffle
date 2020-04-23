module.exports = async (client) => {
    const { walk } = require('walk');
    const { resolve } = require('path');
    const commandLoader = walk('./commands');
    
    client.nekosSafe = new (require('nekos.life'))().sfw;
    client.nekosUnSafe = new (require('nekos.life'))().nsfw;

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

    commandLoader.on('file', async (root, stats, next) => {
        const command = require(`${resolve(root)}/${stats.name}`);
        command.category = root.split('/')[2] || command.category || 'etc';
        client.commands.set(command.name, command);
	    next();
    });
}