const { Event } = require('../structures/Event');

module.exports = class Ready extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        });
    }
    async exec(message) {
        console.log('hi')
    }
}