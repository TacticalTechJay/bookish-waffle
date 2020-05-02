const Handler = require('./Handler');
const Util = require('./Util');
const { Client } = require('discord.js');

class EarthClient extends Client {
    constructor(token, options) {
        super(options);
        this.token = token;

        this.devs = ['328983966650728448', '127888387364487168'];
        this.manager = null;
        this.color = "RANDOM";

        this.handler = new Handler(this);
        this.util = new Util(this);

        this.util.initPG();
        this.handler.loadCommandsNeko();
        this.handler.loadCommands();
        this.handler.loadEvents();
    }
}

module.exports = EarthClient;