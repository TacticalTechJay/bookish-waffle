const Handler = require('./Handler');
const Util = require('./Util');
const winston = require('winston');
const { Client } = require('discord.js');

class EarthClient extends Client {
    constructor(token, options) {
        super(options);
        this.token = token;

        this.devs = ['328983966650728448', '127888387364487168'];
        this.manager = null;
        this.color = 'RANDOM';

        this.handler = new Handler(this);
        this.util = new Util(this);

        this.util.initPG();
        this.handler.loadCommandsNeko();
        this.handler.loadCommands();
        this.handler.loadEvents();
        const colorizer = winston.format.colorize();
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple(),
                winston.format.printf(msg =>
                    colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}: ${msg.message}`)
                )
            ),
            transports: [
                new winston.transports.Console(),
            ]
        });
    }
}

module.exports = EarthClient;