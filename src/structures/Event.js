const EarthClient = require('./EarthClient');

class Event {
    constructor(client, options = {
        name: null,
    }) {
        this.client = client;
        this.name = options.name || null;
    }
}

module.exports = Event;