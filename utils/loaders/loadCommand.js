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
}