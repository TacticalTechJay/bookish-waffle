const { Handler } = require('./Handler');

class EarthClient {
    constructor(token, options) {
        super(options);
        this.token = token;
        this.handler = new Handler();
    }
}

module.exports = {
    EarthClient
}