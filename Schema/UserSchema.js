const { Schema, model } = require('mongoose');

const User = Schema({
    id: String,
    donator: {
        default: false,
        type: Boolean
    },
    blacklisted: {
        default: false,
        type: Boolean
    }
});

module.exports = model('User', User);