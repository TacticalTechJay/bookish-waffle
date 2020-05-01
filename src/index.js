String.prototype.toProperCase = function () {
    return this.toLowerCase().replace(/(^|[\s.])[^\s.]/gm, (s) => s.toUpperCase());
}

new (require('./structures/Extends')).Extends()

const { EarthClient } = require("./structures/EarthClient");
const config = require('../config.json');

const client = new EarthClient(process.env.DEVELOPMENT ? config.tokens.dev : config.tokens.prod, {
    ws: {
        intents: 645
    }
});

client.login();
