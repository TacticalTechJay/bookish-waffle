const { EarthClient } = require("./structures/EarthClient");
const config = require('../config.json');

const client = new EarthClient(process.env.DEVELOPMENT ? config.tokens.dev : config.tokens.prod);

client.login();