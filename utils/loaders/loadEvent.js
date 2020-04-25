module.exports = async (client, cooldowns) => {
    const { walk } = require('walk');
    const { resolve } = require('path');
    const eventLoader = walk('./events');
	eventLoader.on('file', async (root, stats, next) => {
		const event = require(`${resolve(root)}/${stats.name}`);
		client.on(event.name, (...args) => {
			event.exec(...args, client, cooldowns);
		});
		next();
	});
};