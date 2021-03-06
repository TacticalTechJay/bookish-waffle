String.prototype.toProperCase = function() {
    return this.toLowerCase().replace(/(^|[\s.])[^\s.]/gm, (s) => s.toUpperCase());
};

new (require('./structures/Extends'))();

const EarthClient = require('./structures/EarthClient');
const config = require('../config.json');
const Sentry = require('@sentry/node');
Sentry.init({ dsn: config.sentry.dsn });

const client = new EarthClient(process.env.DEVELOPMENT ? config.tokens.dev : config.tokens.prod, {
    ws: {
        intents: 1927
    },
    messageCacheMaxSize: 100,
    messageCacheLifetime: 3600,
    messageSweepInterval: 7200,
    disableMentions: 'everyone'
});

client.login();
