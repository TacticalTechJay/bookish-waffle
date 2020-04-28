const { Handler } = require('./Handler');
const { Client } = require('discord.js');

class EarthClient extends Client {
    constructor(token, options) {
        super(options);
        this.token = token;

        this.handler = new Handler(this);

        this.handler.loadCommands();
        this.handler.loadEvents();
    }
}

module.exports = {
    EarthClient
}