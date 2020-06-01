const config = require('../../config.json');

module.exports = {
    name: 'Guild',
    columns: {
        id: {
            primary: true,
            type: 'text',
        },
        prefix: {
            type: 'text',
            default: process.env.DEVELOPMENT ? config.prefixes.dev : config.prefixes.prod
        }
    }
};